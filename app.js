// ============================================
// AI Token 转售管理系统
// ============================================

var supabaseClient = null;
var currentUser = null;
var userProfile = null;
var selectedAmount = 50;

// ============================================
// 价格计算功能
// ============================================
function getModelPricing(model) {
    if (typeof CONFIG === 'undefined' || !CONFIG.PRICING) return null;
    if (model === 'v4-flash') return CONFIG.PRICING.V4_FLASH;
    if (model === 'v4-pro') return CONFIG.PRICING.V4_PRO;
    return null;
}

function calculateCost(model, inputHitTokens, inputMissTokens, outputTokens) {
    var pricing = getModelPricing(model);
    if (!pricing) return 0;
    var multiplier = CONFIG.PRICING.MARKUP_MULTIPLIER || 1.5;
    // 计算成本（每百万token）
    var inputHitCost = (inputHitTokens / 1000000) * pricing.INPUT_CACHE_HIT;
    var inputMissCost = (inputMissTokens / 1000000) * pricing.INPUT_CACHE_MISS;
    var outputCost = (outputTokens / 1000000) * pricing.OUTPUT;
    // 加价后总价
    var totalCost = (inputHitCost + inputMissCost + outputCost) * multiplier;
    return Math.round(totalCost * 10000) / 10000; // 保留4位小数
}

// ============================================
// 语言功能 - 全局可用
// ============================================
function applyLanguage(lang) {
    // 同时更新两个 localStorage key，保持同步
    localStorage.setItem('selectedLang', lang);
    localStorage.setItem('lang', lang);
    // 同步更新 i18n.js 的 currentLang 变量
    if (typeof setLang === 'function') {
        setLang(lang);
    }
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
        var key = elements[i].getAttribute('data-i18n');
        if (typeof I18N !== 'undefined' && I18N[lang] && I18N[lang][key]) {
            elements[i].textContent = I18N[lang][key];
        }
    }
    var btns = document.querySelectorAll('.lang-btn');
    for (var j = 0; j < btns.length; j++) {
        btns[j].classList.remove('active');
        if (btns[j].getAttribute('data-lang') === lang) {
            btns[j].classList.add('active');
        }
    }
}

// ============================================
// 管理员 - 计算用量费用
// ============================================
function calculateUsageCost() {
    var model = document.getElementById('usageModelSelect').value;
    var inputHit = parseInt(document.getElementById('usageInputHit').value) || 0;
    var inputMiss = parseInt(document.getElementById('usageInputMiss').value) || 0;
    var output = parseInt(document.getElementById('usageOutput').value) || 0;
    
    var pricing = getModelPricing(model);
    if (!pricing) { alert('请选择模型'); return; }
    var multiplier = CONFIG.PRICING.MARKUP_MULTIPLIER || 1.5;
    
    // 计算各项费用
    var costHit = (inputHit / 1000000) * pricing.INPUT_CACHE_HIT * multiplier;
    var costMiss = (inputMiss / 1000000) * pricing.INPUT_CACHE_MISS * multiplier;
    var costOutput = (output / 1000000) * pricing.OUTPUT * multiplier;
    var total = costHit + costMiss + costOutput;
    
    // 显示预览
    document.getElementById('usageCostPreview').style.display = 'block';
    document.getElementById('costInputHit').textContent = costHit.toFixed(4) + '元';
    document.getElementById('costInputMiss').textContent = costMiss.toFixed(4) + '元';
    document.getElementById('costOutput').textContent = costOutput.toFixed(4) + '元';
    document.getElementById('costTotal').textContent = total.toFixed(4) + '元';
}

// ============================================
// 管理员 - 提交用量记录
// ============================================
function submitUsageRecord() {
    if (!currentUser || !supabaseClient || !userProfile || userProfile.role !== 'admin') {
        alert('需要管理员权限');
        return;
    }
    
    var userId = document.getElementById('usageUserSelect').value;
    var model = document.getElementById('usageModelSelect').value;
    var apiKey = document.getElementById('usageApiKey').value.trim();
    var inputHit = parseInt(document.getElementById('usageInputHit').value) || 0;
    var inputMiss = parseInt(document.getElementById('usageInputMiss').value) || 0;
    var output = parseInt(document.getElementById('usageOutput').value) || 0;
    
    if (!userId) { alert('请选择客户'); return; }
    if (inputHit === 0 && inputMiss === 0 && output === 0) { alert('请填写至少一项Token数量'); return; }
    
    var cost = calculateCost(model, inputHit, inputMiss, output);
    
    // 获取客户当前余额
    supabaseClient.from('profiles').select('balance').eq('id', userId).single().then(function(res) {
        if (res.error || !res.data) {
            alert('获取客户信息失败');
            return;
        }
        
        var currentBalance = res.data.balance || 0;
        if (currentBalance < cost) {
            alert('客户余额不足！当前余额: ¥' + currentBalance.toFixed(4) + '，需要: ¥' + cost.toFixed(4));
            return;
        }
        
        // 扣减余额并记录用量
        var newBalance = currentBalance - cost;
        
        // 更新余额
        supabaseClient.from('profiles').update({ balance: newBalance }).eq('id', userId).then(function(updateRes) {
            if (updateRes.error) {
                alert('更新余额失败: ' + updateRes.error.message);
                return;
            }
            
            // 插入用量记录
            var record = {
                user_id: userId,
                model: model,
                api_key: apiKey,
                input_tokens_cache_hit: inputHit,
                input_tokens_cache_miss: inputMiss,
                output_tokens: output,
                unit_price: cost / ((inputHit + inputMiss + output) || 1),
                cost: cost,
                tokens_used: inputHit + inputMiss + output,
                recorded_by: currentUser.email,
                created_at: new Date().toISOString()
            };
            
            supabaseClient.from('usage_records').insert(record).then(function(insertRes) {
                if (insertRes.error) {
                    alert('记录用量失败: ' + insertRes.error.message);
                    return;
                }
                
                alert('用量已录入！扣费: ¥' + cost.toFixed(4) + '，剩余余额: ¥' + newBalance.toFixed(4));
                
                // 清空表单
                document.getElementById('usageInputHit').value = '0';
                document.getElementById('usageInputMiss').value = '0';
                document.getElementById('usageOutput').value = '0';
                document.getElementById('usageApiKey').value = '';
                document.getElementById('usageCostPreview').style.display = 'none';
                
                // 刷新数据
                loadAdminData();
            });
        });
    });
}

// ============================================
// 管理员 - 加载客户列表
// ============================================
function loadCustomerList() {
    if (!currentUser || !supabaseClient) return;
    
    supabaseClient.from('profiles').select('id, username, email, balance, balance_warning').then(function(res) {
        if (res.error) {
            console.error('加载客户列表失败:', res.error);
            return;
        }
        
        // 更新下拉选择框
        var select = document.getElementById('usageUserSelect');
        if (select) {
            select.innerHTML = '<option value="">-- 选择客户 --</option>';
            for (var i = 0; i < res.data.length; i++) {
                var user = res.data[i];
                if (user.role !== 'admin') {
                    select.innerHTML += '<option value="' + user.id + '">' + (user.username || user.email) + ' (余额: ¥' + (user.balance || 0) + ')</option>';
                }
            }
        }
        
        // 更新客户管理表格
        var tbody = document.getElementById('adminCustomerTable');
        if (tbody) {
            if (!res.data || res.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#6b7280;">暂无客户</td></tr>';
                return;
            }
            var html = '';
            for (var j = 0; j < res.data.length; j++) {
                var c = res.data[j];
                if (c.role === 'admin') continue;
                html += '<tr>';
                html += '<td>' + (c.username || '-') + '</td>';
                html += '<td>' + c.email + '</td>';
                html += '<td>¥' + (c.balance || 0).toFixed(2) + '</td>';
                html += '<td id="usage-' + c.id + '">加载中...</td>';
                html += '<td><input type="number" id="warning-' + c.id + '" value="' + (c.balance_warning || CONFIG.DEFAULT_BALANCE_WARNING || 10) + '" style="width:80px;padding:4px;">元</td>';
                html += '<td><button class="btn btn-success" onclick="setBalanceWarning(\'' + c.id + '\')" style="padding:6px 12px;font-size:13px;">' + (typeof I18N !== 'undefined' && I18N[currentLang] ? I18N[currentLang]['admin_set_warning'] : '设置预警') + '</button></td>';
                html += '</tr>';
            }
            tbody.innerHTML = html;
            
            // 加载每个客户的总用量
            for (var k = 0; k < res.data.length; k++) {
                var userId = res.data[k].id;
                loadCustomerUsage(userId);
            }
        }
    });
}

// ============================================
// 管理员 - 加载客户总用量
// ============================================
function loadCustomerUsage(userId) {
    if (!supabaseClient) return;
    
    supabaseClient.from('usage_records').select('cost').eq('user_id', userId).then(function(res) {
        var totalCost = 0;
        if (res.data) {
            for (var i = 0; i < res.data.length; i++) {
                totalCost += res.data[i].cost || 0;
            }
        }
        var el = document.getElementById('usage-' + userId);
        if (el) el.textContent = '¥' + totalCost.toFixed(2);
    });
}

// ============================================
// 管理员 - 设置余额预警阈值
// ============================================
function setBalanceWarning(userId) {
    if (!currentUser || !supabaseClient) return;
    
    var warningInput = document.getElementById('warning-' + userId);
    if (!warningInput) return;
    
    var warningValue = parseFloat(warningInput.value);
    if (isNaN(warningValue) || warningValue < 0) {
        alert('请输入有效的预警金额');
        return;
    }
    
    supabaseClient.from('profiles').update({ balance_warning: warningValue }).eq('id', userId).then(function(res) {
        if (res.error) {
            alert('设置失败: ' + res.error.message);
            return;
        }
        alert('预警阈值已设置为 ¥' + warningValue);
    });
}

// ============================================
// 管理员 - 加载用量记录
// ============================================
function loadAdminUsageRecords() {
    if (!currentUser || !supabaseClient) return;
    
    supabaseClient.from('usage_records').select('*').order('created_at', {ascending: false}).limit(50).then(function(res) {
        var tbody = document.getElementById('adminUsageTable');
        if (!tbody) return;
        
        if (res.error || !res.data || res.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#6b7280;">暂无记录</td></tr>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < res.data.length; i++) {
            var r = res.data[i];
            html += '<tr>';
            html += '<td>' + (r.user_id ? r.user_id.substring(0,8) + '...' : '-') + '</td>';
            html += '<td>' + (r.model || '-') + '</td>';
            html += '<td>' + (r.input_tokens_cache_hit || 0) + '</td>';
            html += '<td>' + (r.input_tokens_cache_miss || 0) + '</td>';
            html += '<td>' + (r.output_tokens || 0) + '</td>';
            html += '<td style="color:#ef4444;font-weight:bold;">¥' + (r.cost || 0).toFixed(4) + '</td>';
            html += '<td>' + new Date(r.created_at).toLocaleString() + '</td>';
            html += '</tr>';
        }
        tbody.innerHTML = html;
    });
}

// ============================================
// 页面导航 - 全局可用
// ============================================
function showPage(pageId) {
    // 权限检查 - 在显示页面之前
    if (['dashboard', 'recharge', 'api', 'history'].indexOf(pageId) !== -1 && !currentUser) {
        pageId = 'login';
    }
    if (pageId === 'admin' && (!currentUser || !userProfile || userProfile.role !== 'admin')) {
        pageId = 'login';
    }
    
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    var target = document.getElementById('page-' + pageId);
    if (target) {
        target.style.display = 'block';
    }
    var links = document.querySelectorAll('[data-page]');
    for (var j = 0; j < links.length; j++) {
        links[j].classList.remove('active');
        if (links[j].getAttribute('data-page') === pageId) {
            links[j].classList.add('active');
        }
    }
    // 控制导航链接显示/隐藏
    updateNavVisibility();
    if (pageId === 'admin') loadAdminData();
    if (pageId === 'dashboard' && currentUser) loadDashboard();
    if (pageId === 'api' && currentUser) loadApiKeys();
    if (pageId === 'history' && currentUser) loadHistory();
    if (pageId === 'recharge') {
        updatePaymentInfo();
        generateBankQRCode();
    }
}

// 控制导航链接显示/隐藏
function updateNavVisibility() {
    var adminLink = document.querySelector('[data-page="admin"]');
    var dashboardLink = document.querySelector('[data-page="dashboard"]');
    var rechargeLink = document.querySelector('[data-page="recharge"]');
    var apiLink = document.querySelector('[data-page="api"]');
    var historyLink = document.querySelector('[data-page="history"]');
    
    if (!currentUser) {
        // 未登录：隐藏需要登录的页面
        if (dashboardLink) dashboardLink.parentElement.style.display = 'none';
        if (rechargeLink) rechargeLink.parentElement.style.display = 'none';
        if (apiLink) apiLink.parentElement.style.display = 'none';
        if (historyLink) historyLink.parentElement.style.display = 'none';
        if (adminLink) adminLink.parentElement.style.display = 'none';
    } else if (userProfile && userProfile.role === 'admin') {
        // 管理员：显示所有
        if (dashboardLink) dashboardLink.parentElement.style.display = '';
        if (rechargeLink) rechargeLink.parentElement.style.display = '';
        if (apiLink) apiLink.parentElement.style.display = '';
        if (historyLink) historyLink.parentElement.style.display = '';
        if (adminLink) adminLink.parentElement.style.display = '';
    } else {
        // 普通用户：隐藏管理后台
        if (dashboardLink) dashboardLink.parentElement.style.display = '';
        if (rechargeLink) rechargeLink.parentElement.style.display = '';
        if (apiLink) apiLink.parentElement.style.display = '';
        if (historyLink) historyLink.parentElement.style.display = '';
        if (adminLink) adminLink.parentElement.style.display = 'none';
    }
}

// ============================================
// 登录
// ============================================
function handleLogin() {
    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;
    if (!email || !password) { alert('请填写所有必填项'); return; }
    if (!supabaseClient) { alert('系统初始化中，请稍后重试'); return; }
    supabaseClient.auth.signInWithPassword({ email: email, password: password }).then(function(res) {
        if (res.error) { alert('登录失败: ' + res.error.message); return; }
        currentUser = res.data.user;
        // 先确保 profiles 存在，然后加载资料，最后跳转
        supabaseClient.from('profiles').select('*').eq('id', currentUser.id).single().then(function(pr) {
            if (pr.error || !pr.data) {
                // 不存在则创建
                supabaseClient.from('profiles').insert({ id: currentUser.id, username: email.split('@')[0], email: email, balance: 0, role: 'user' }).then(function() {
                    loadUserProfileAndRedirect(email);
                });
            } else {
                userProfile = pr.data;
                alert('登录成功');
                // 管理员跳管理后台，普通用户跳控制台
                if (userProfile.role === 'admin') {
                    showPage('admin');
                } else {
                    showPage('dashboard');
                }
            }
        });
    }).catch(function(err) {
        alert('登录失败');
    });
}

function loadUserProfileAndRedirect(email) {
    supabaseClient.from('profiles').select('*').eq('id', currentUser.id).single().then(function(res) {
        if (res.data) userProfile = res.data;
        alert('登录成功');
        if (userProfile && userProfile.role === 'admin') {
            showPage('admin');
        } else {
            showPage('dashboard');
        }
    });
}

// ============================================
// 注册
// ============================================
function handleRegister() {
    var username = document.getElementById('regUsername').value.trim();
    var email = document.getElementById('regEmail').value.trim();
    var password = document.getElementById('regPassword').value;
    var confirm = document.getElementById('regConfirmPassword').value;
    if (!username || !email || !password || !confirm) { alert('请填写所有必填项'); return; }
    if (password !== confirm) { alert('两次密码不一致'); return; }
    if (password.length < 6) { alert('密码至少6位'); return; }
    if (!supabaseClient) { alert('系统初始化中，请稍后重试'); return; }
    supabaseClient.auth.signUp({ email: email, password: password }).then(function(res) {
        if (res.error) { alert('注册失败: ' + res.error.message); return; }
        if (res.data.user) {
            // 创建 profiles 记录
            supabaseClient.from('profiles').insert({ id: res.data.user.id, username: username, email: email, balance: 0, role: 'user' }).then(function(insertRes) {
                if (insertRes.error) {
                    console.error('创建用户资料失败:', insertRes.error);
                }
            });
            alert('注册成功！请去邮箱确认后登录');
            showPage('login');
        }
    }).catch(function(err) {
        alert('注册失败');
    });
}

// ============================================
// 退出
// ============================================
function logout() {
    if (supabaseClient) { supabaseClient.auth.signOut(); }
    currentUser = null;
    userProfile = null;
    showPage('home');
}

// ============================================
// 加载用户资料
// ============================================
function loadUserProfile() {
    if (!currentUser || !supabaseClient) return Promise.resolve();
    return supabaseClient.from('profiles').select('*').eq('id', currentUser.id).single().then(function(res) {
        if (res.data) userProfile = res.data;
    });
}

// ============================================
// 控制台
// ============================================
function loadDashboard() {
    if (!currentUser || !supabaseClient) return;
    // 直接从数据库获取最新余额，不依赖缓存
    supabaseClient.from('profiles').select('balance, balance_warning').eq('id', currentUser.id).single().then(function(res) {
        if (res.data) {
            userProfile.balance = res.data.balance;
            document.getElementById('balanceValue').textContent = res.data.balance || 0;
            
            // 检查余额预警
            var warning = res.data.balance_warning || CONFIG.DEFAULT_BALANCE_WARNING || 10;
            if ((res.data.balance || 0) < warning) {
                alert('⚠️ 余额不足预警！当前余额: ¥' + (res.data.balance || 0).toFixed(2) + '\n请及时充值！');
            }
        }
    });
    // 加载分配的API Key
    loadAssignedApiKey();
}

// ============================================
// API密钥
// ============================================
function loadApiKeys() {
    if (!currentUser || !supabaseClient) return;
    supabaseClient.from('api_keys').select('*').eq('user_id', currentUser.id).then(function(res) {
        var box = document.getElementById('apiKeyList');
        if (!box) return;
        if (res.error) {
            console.error('加载密钥失败:', res.error);
            box.innerHTML = '<p style="text-align:center;color:#ef4444;padding:40px;">加载失败: ' + (res.error.message || '') + '</p>';
            return;
        }
        if (!res.data || res.data.length === 0) {
            box.innerHTML = '<p style="text-align:center;color:#6b7280;padding:40px;">暂无API密钥</p>';
            return;
        }
        var html = '';
        for (var i = 0; i < res.data.length; i++) {
            var k = res.data[i];
            var keyVal = k.api_key || k.key_value || '';
            var mask = keyVal.substring(0,4) + '****' + keyVal.substring(keyVal.length-4);
            html += '<div class="api-item"><div class="api-key-display">' + mask + '</div>';
            html += '<div class="api-actions">';
            html += '<button class="btn btn-secondary" onclick="copyKey(\'' + keyVal + '\')">复制</button>';
            html += '<button class="btn btn-danger" onclick="deleteKey(\'' + k.id + '\')">删除</button>';
            html += '</div></div>';
        }
        box.innerHTML = html;
    });
}

function createApiKey() {
    if (!currentUser || !supabaseClient) { alert('请先登录'); return; }
    var name = prompt('密钥名称:', 'My API Key');
    if (name === null) return;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var key = 'sk-';
    for (var i = 0; i < 48; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
    supabaseClient.from('api_keys').insert({ user_id: currentUser.id, api_key: key, status: 'active' }).then(function(res) {
        if (res.error) {
            console.error('创建密钥失败:', res.error);
            alert('创建失败: ' + (res.error.message || JSON.stringify(res.error)));
            return;
        }
        alert('API密钥已创建');
        loadApiKeys();
    });
}

function deleteKey(id) {
    if (!confirm('确定删除？')) return;
    supabaseClient.from('api_keys').delete().eq('id', id).then(function(res) {
        if (res.error) { alert('删除失败'); return; }
        loadApiKeys();
    });
}

function copyKey(key) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(key).then(function() { alert('已复制'); });
    } else {
        var t = document.createElement('textarea');
        t.value = key;
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
        alert('已复制');
    }
}

// ============================================
// 管理员 - 主API Key管理
// ============================================
function addMasterApiKey() {
    if (!currentUser || !supabaseClient || !userProfile || userProfile.role !== 'admin') {
        alert('需要管理员权限');
        return;
    }
    
    var name = document.getElementById('masterKeyName').value.trim();
    var keyValue = document.getElementById('masterKeyValue').value.trim();
    
    if (!name) { alert('请输入Key名称'); return; }
    if (!keyValue || !keyValue.startsWith('sk-')) { alert('请输入有效的 API Key (sk-...)'); return; }
    
    // 检查是否已存在相同的key
    supabaseClient.from('api_keys').select('id').eq('api_key', keyValue).then(function(res) {
        if (res.data && res.data.length > 0) {
            alert('该Key已存在');
            return;
        }
        
        // 插入主Key
        supabaseClient.from('api_keys').insert({
            user_id: currentUser.id,
            api_key: keyValue,
            key_name: name,
            is_master: true,
            status: 'active'
        }).then(function(insertRes) {
            if (insertRes.error) {
                alert('添加失败: ' + insertRes.error.message);
                return;
            }
            alert('Key已添加');
            document.getElementById('masterKeyName').value = '';
            document.getElementById('masterKeyValue').value = '';
            loadMasterKeys();
        });
    });
}

function loadMasterKeys() {
    if (!currentUser || !supabaseClient) return;
    
    supabaseClient.from('api_keys').select('*').eq('is_master', true).then(function(res) {
        var tbody = document.getElementById('masterKeyTable');
        if (!tbody) return;
        
        if (res.error || !res.data || res.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;color:#6b7280;">暂无主Key</td></tr>';
            return;
        }
        
        // 获取所有用户信息用于显示
        supabaseClient.from('profiles').select('id, username, email').then(function(userRes) {
            var users = {};
            if (userRes.data) {
                for (var u = 0; u < userRes.data.length; u++) {
                    users[userRes.data[u].id] = userRes.data[u];
                }
            }
            
            var html = '';
            for (var i = 0; i < res.data.length; i++) {
                var k = res.data[i];
                var mask = k.api_key.substring(0,8) + '****' + k.api_key.substring(k.api_key.length-4);
                var assignedName = '未分配';
                if (k.assigned_to && users[k.assigned_to]) {
                    assignedName = users[k.assigned_to].username || users[k.assigned_to].email;
                }
                html += '<tr>';
                html += '<td>' + (k.key_name || '-') + '</td>';
                html += '<td style="font-family:monospace;font-size:12px;">' + mask + '</td>';
                html += '<td><span class="status-badge status-active">可用</span></td>';
                html += '<td>' + assignedName + '</td>';
                html += '<td>';
                if (k.assigned_to) {
                    html += '<button class="btn btn-danger" onclick="unassignApiKey(\'' + k.id + '\')" style="padding:4px 8px;font-size:12px;margin-right:4px;">取消分配</button>';
                } else {
                    html += '<button class="btn btn-success" onclick="showAssignModal(\'' + k.id + '\')" style="padding:4px 8px;font-size:12px;margin-right:4px;">分配</button>';
                }
                html += '<button class="btn btn-danger" onclick="deleteMasterKey(\'' + k.id + '\')" style="padding:4px 8px;font-size:12px;">删除</button>';
                html += '</td>';
                html += '</tr>';
            }
            tbody.innerHTML = html;
        });
    });
}

function showAssignModal(keyId) {
    if (!currentUser || !supabaseClient) return;
    
    // 获取未分配的客户列表
    supabaseClient.from('profiles').select('id, username, email').then(function(res) {
        if (res.error || !res.data) {
            alert('获取客户列表失败');
            return;
        }
        
        // 过滤掉管理员和已分配的用户
        var options = '';
        for (var i = 0; i < res.data.length; i++) {
            var user = res.data[i];
            if (user.role !== 'admin') {
                options += '<option value="' + user.id + '">' + (user.username || user.email) + '</option>';
            }
        }
        
        var userId = prompt('选择客户ID（从下拉列表选择或输入）:\n\n可选客户：\n' + res.data.filter(function(u){return u.role !== 'admin'}).map(function(u){return u.username || u.email}).join('\n'));
        
        if (!userId) return;
        
        // 查找用户ID
        var targetUser = res.data.find(function(u) {
            return u.id === userId || u.username === userId || u.email === userId;
        });
        
        if (!targetUser) {
            alert('未找到该客户');
            return;
        }
        
        // 分配Key
        supabaseClient.from('api_keys').update({
            assigned_to: targetUser.id,
            assigned_at: new Date().toISOString()
        }).eq('id', keyId).then(function(updateRes) {
            if (updateRes.error) {
                alert('分配失败: ' + updateRes.error.message);
                return;
            }
            alert('Key已分配给 ' + (targetUser.username || targetUser.email));
            loadMasterKeys();
        });
    });
}

function unassignApiKey(keyId) {
    if (!confirm('确定取消分配？')) return;
    
    supabaseClient.from('api_keys').update({
        assigned_to: null,
        assigned_at: null
    }).eq('id', keyId).then(function(res) {
        if (res.error) {
            alert('取消分配失败: ' + res.error.message);
            return;
        }
        alert('已取消分配');
        loadMasterKeys();
    });
}

function deleteMasterKey(keyId) {
    if (!confirm('确定删除该Key？')) return;
    
    supabaseClient.from('api_keys').delete().eq('id', keyId).then(function(res) {
        if (res.error) {
            alert('删除失败: ' + res.error.message);
            return;
        }
        alert('Key已删除');
        loadMasterKeys();
    });
}

// ============================================
// 客户端 - 加载分配的API Key
// ============================================
function loadAssignedApiKey() {
    if (!currentUser || !supabaseClient) return;
    
    var display = document.getElementById('assignedApiKeyDisplay');
    if (!display) return;
    
    supabaseClient.from('api_keys').select('*').eq('assigned_to', currentUser.id).eq('status', 'active').then(function(res) {
        var lang = (typeof getLang === 'function') ? getLang() : 'zh';
        var noKeyMsg = (typeof I18N !== 'undefined' && I18N[lang] && I18N[lang]['admin_no_key_assigned']) ? I18N[lang]['admin_no_key_assigned'] : '暂未分配API Key，请联系管理员';
        var copyBtnText = (typeof I18N !== 'undefined' && I18N[lang] && I18N[lang]['api_copy']) ? I18N[lang]['api_copy'] : '复制';
        
        if (res.error || !res.data || res.data.length === 0) {
            display.innerHTML = '<div class="alert alert-warning">' + noKeyMsg + '</div>';
            return;
        }
        
        var html = '';
        for (var i = 0; i < res.data.length; i++) {
            var k = res.data[i];
            var mask = k.api_key.substring(0,8) + '****' + k.api_key.substring(k.api_key.length-4);
            html += '<div class="api-item">';
            html += '<div class="api-key-display">' + mask + '</div>';
            html += '<div class="api-actions">';
            html += '<button class="btn btn-primary" onclick="copyKey(\'' + k.api_key + '\')">' + copyBtnText + ' Key</button>';
            html += '</div>';
            html += '</div>';
        }
        display.innerHTML = html;
    });
}

// ============================================
// 充值
// ============================================
function updatePaymentInfo() {
    if (typeof CONFIG !== 'undefined' && CONFIG.PAYMENT) {
        var lang = (typeof getLang === 'function') ? getLang() : 'zh';
        var e1 = document.getElementById('bankName');
        var e2 = document.getElementById('bankAccount');
        var e3 = document.getElementById('accountName');
        var e4 = document.getElementById('bankBranch');
        var e5 = document.getElementById('swiftCode');
        if (e1) e1.textContent = CONFIG.PAYMENT.BANK_NAME[lang] || CONFIG.PAYMENT.BANK_NAME['zh'];
        if (e2) e2.textContent = CONFIG.PAYMENT.BANK_ACCOUNT;
        if (e3) e3.textContent = CONFIG.PAYMENT.ACCOUNT_NAME[lang] || CONFIG.PAYMENT.ACCOUNT_NAME['zh'];
        if (e4) e4.textContent = CONFIG.PAYMENT.BANK_BRANCH[lang] || CONFIG.PAYMENT.BANK_BRANCH['zh'];
        if (e5) e5.textContent = CONFIG.PAYMENT.SWIFT_CODE;
    }
}

function updateSelectedAmountDisplay() {
    var display = document.getElementById('selectedAmountText');
    if (display) {
        display.textContent = '¥' + selectedAmount;
    }
}

function submitRecharge() {
    if (!currentUser) { alert('请先登录'); showPage('login'); return; }
    var fileInput = document.getElementById('proofFile');
    var file = fileInput.files[0];
    if (!file) { alert('请上传转账凭证'); return; }
    var fileName = currentUser.id + '/' + Date.now() + '_' + file.name;
    supabaseClient.storage.from('payment-proofs').upload(fileName, file).then(function(upRes) {
        if (upRes.error) {
            console.error('上传失败详情:', upRes.error);
            alert('上传失败: ' + (upRes.error.message || JSON.stringify(upRes.error)));
            return;
        }
        var urlData = supabaseClient.storage.from('payment-proofs').getPublicUrl(fileName);
        supabaseClient.from('recharges').insert({ user_id: currentUser.id, amount: selectedAmount, status: 'pending', proof_url: urlData.data.publicUrl }).then(function(inRes) {
            if (inRes.error) { alert('提交失败'); return; }
            alert('充值申请已提交');
            fileInput.value = '';
            document.getElementById('fileName').textContent = '';
        });
    });
}

// ============================================
// 使用记录
// ============================================
function loadHistory() {
    if (!currentUser || !supabaseClient) return;
    
    // 先加载余额
    supabaseClient.from('profiles').select('balance, balance_warning').eq('id', currentUser.id).single().then(function(profileRes) {
        if (profileRes.data) {
            var balance = profileRes.data.balance || 0;
            var warning = profileRes.data.balance_warning || CONFIG.DEFAULT_BALANCE_WARNING || 10;
            
            document.getElementById('historyBalance').textContent = '¥' + balance.toFixed(2);
            
            // 检查余额预警
            var warningEl = document.getElementById('balanceWarning');
            if (warningEl) {
                if (balance < warning) {
                    warningEl.style.display = 'block';
                } else {
                    warningEl.style.display = 'none';
                }
            }
        }
    });
    
    // 加载用量记录
    supabaseClient.from('usage_records').select('*').eq('user_id', currentUser.id).order('created_at', {ascending: false}).then(function(res) {
        var tbody = document.getElementById('historyTable');
        if (!tbody) return;
        if (!res.data || res.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#6b7280;">暂无记录</td></tr>';
            return;
        }
        var html = '';
        var totalTokens = 0;
        var totalCost = 0;
        for (var i = 0; i < res.data.length; i++) {
            var r = res.data[i];
            var tokens = r.tokens_used || 0;
            var cost = r.cost || 0;
            totalTokens += tokens;
            totalCost += cost;
            html += '<tr>';
            html += '<td>' + new Date(r.created_at).toLocaleDateString() + '</td>';
            html += '<td>' + (r.model || '-') + '</td>';
            html += '<td style="font-family:monospace;font-size:12px;">' + (r.api_key ? r.api_key.substring(0,8) + '...' : '-') + '</td>';
            html += '<td>' + (r.input_tokens_cache_hit || 0) + '</td>';
            html += '<td>' + (r.input_tokens_cache_miss || 0) + '</td>';
            html += '<td>' + (r.output_tokens || 0) + '</td>';
            html += '<td style="color:#ef4444;font-weight:bold;">¥' + cost.toFixed(4) + '</td>';
            html += '</tr>';
        }
        // 添加汇总行
        html += '<tr style="background:#f0f9ff;font-weight:bold;">';
        html += '<td colspan="3">合计</td>';
        html += '<td>-</td>';
        html += '<td>-</td>';
        html += '<td>' + totalTokens + '</td>';
        html += '<td style="color:#ef4444;">¥' + totalCost.toFixed(4) + '</td>';
        html += '</tr>';
        tbody.innerHTML = html;
    });
}

// ============================================
// 管理后台
// ============================================
function loadAdminData() {
    if (!currentUser || !supabaseClient || !userProfile || userProfile.role !== 'admin') return;
    supabaseClient.from('profiles').select('*', {count: 'exact', head: true}).then(function(res) {
        document.getElementById('adminUserCount').textContent = res.count || 0;
    });
    supabaseClient.from('recharges').select('amount, status').then(function(res) {
        if (res.data) {
            var total = 0, pending = 0;
            for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].status === 'approved') total += res.data[i].amount;
                if (res.data[i].status === 'pending') pending++;
            }
            document.getElementById('adminTotalRecharge').textContent = '¥' + total;
            document.getElementById('adminPendingRecharge').textContent = pending;
        }
    });
    // 加载总用量
    supabaseClient.from('usage_records').select('cost').then(function(res) {
        var totalUsage = 0;
        if (res.data) {
            for (var i = 0; i < res.data.length; i++) {
                totalUsage += res.data[i].cost || 0;
            }
        }
        document.getElementById('adminTotalUsage').textContent = '¥' + totalUsage.toFixed(2);
    });
    loadAdminRecharges();
    loadCustomerList();
    loadAdminUsageRecords();
    loadMasterKeys();
}

// ============================================
// 管理员 - 查看客户详情
// ============================================
function showCustomerDetails() {
    if (!currentUser || !supabaseClient) return;
    
    supabaseClient.from('profiles').select('*').then(function(res) {
        if (res.error || !res.data) {
            alert('加载客户列表失败');
            return;
        }
        
        var html = '<div style="max-height:400px;overflow-y:auto;">';
        html += '<table style="width:100%;border-collapse:collapse;">';
        html += '<tr style="background:#f3f4f6;"><th style="padding:8px;text-align:left;border-bottom:1px solid #e5e7eb;">用户名</th><th style="padding:8px;text-align:left;border-bottom:1px solid #e5e7eb;">邮箱</th><th style="padding:8px;text-align:left;border-bottom:1px solid #e5e7eb;">余额</th><th style="padding:8px;text-align:left;border-bottom:1px solid #e5e7eb;">角色</th></tr>';
        
        for (var i = 0; i < res.data.length; i++) {
            var user = res.data[i];
            var roleText = user.role === 'admin' ? '管理员' : '用户';
            var roleColor = user.role === 'admin' ? '#ef4444' : '#10b981';
            html += '<tr style="border-bottom:1px solid #e5e7eb;">';
            html += '<td style="padding:8px;">' + (user.username || '-') + '</td>';
            html += '<td style="padding:8px;">' + user.email + '</td>';
            html += '<td style="padding:8px;">¥' + (user.balance || 0).toFixed(2) + '</td>';
            html += '<td style="padding:8px;color:' + roleColor + ';">' + roleText + '</td>';
            html += '</tr>';
        }
        html += '</table></div>';
        
        // 创建弹窗显示
        var modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = '<div style="background:white;border-radius:12px;padding:24px;max-width:600px;width:90%;max-height:80vh;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
            '<h3 style="margin:0;">客户列表</h3>' +
            '<button onclick="this.closest(\'div[class]\').parentElement.remove()" style="background:none;border:none;font-size:24px;cursor:pointer;">&times;</button>' +
            '</div>' + html + '</div>';
        document.body.appendChild(modal);
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
    });
}

function loadAdminRecharges() {
    supabaseClient.from('recharges').select('*').then(function(res) {
        var tbody = document.getElementById('adminRechargeTable');
        if (!tbody) return;
        if (res.error) {
            console.error('加载充值记录失败:', res.error);
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#ef4444;">加载失败</td></tr>';
            return;
        }
        if (!res.data || res.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#6b7280;">暂无记录</td></tr>';
            return;
        }
        var html = '';
        for (var i = 0; i < res.data.length; i++) {
            var r = res.data[i];
            var sc = r.status === 'approved' ? 'status-active' : (r.status === 'pending' ? 'status-pending' : 'status-disabled');
            var st = r.status === 'approved' ? '已确认' : (r.status === 'pending' ? '待确认' : '已拒绝');
            html += '<tr><td>' + (r.user_id ? r.user_id.substring(0,8) + '...' : '-') + '</td><td>¥' + r.amount + '</td><td>' + new Date(r.created_at).toLocaleString() + '</td>';
            html += '<td>' + (r.proof_url ? '<a href="' + r.proof_url + '" target="_blank">查看</a>' : '-') + '</td>';
            html += '<td><span class="status-badge ' + sc + '">' + st + '</span></td>';
            html += '<td>';
            if (r.status === 'pending') {
                html += '<button class="btn btn-success" onclick="confirmRecharge(\'' + r.id + '\',\'approved\')" style="margin-right:8px;">确认</button>';
                html += '<button class="btn btn-danger" onclick="confirmRecharge(\'' + r.id + '\',\'rejected\')">拒绝</button>';
            }
            html += '<button class="btn btn-danger" onclick="deleteRecharge(\'' + r.id + '\')" style="margin-left:8px;">删除</button>';
            html += '</td></tr>';
        }
        tbody.innerHTML = html;
    });
}

function deleteRecharge(id) {
    if (!confirm('确定删除该充值记录？')) return;
    
    supabaseClient.from('recharges').delete().eq('id', id).then(function(res) {
        if (res.error) {
            alert('删除失败: ' + res.error.message);
            return;
        }
        alert('已删除');
        loadAdminData();
    });
}

function confirmRecharge(id, status) {
    // 先获取充值记录
    supabaseClient.from('recharges').select('*').eq('id', id).single().then(function(rr) {
        if (rr.error || !rr.data) {
            alert('操作失败');
            return;
        }
        var recharge = rr.data;
        console.log('获取到充值记录:', recharge);
        
        // 更新充值状态
        supabaseClient.from('recharges').update({status: status, updated_at: new Date().toISOString()}).eq('id', id).then(function(res) {
            if (res.error) {
                alert('操作失败: ' + res.error.message);
                return;
            }
            console.log('充值状态已更新');
            
            // 如果是批准，更新用户余额
            if (status === 'approved') {
                supabaseClient.from('profiles').select('balance').eq('id', recharge.user_id).single().then(function(pr) {
                    console.log('当前余额:', pr.data);
                    var currentBalance = pr.data ? (pr.data.balance || 0) : 0;
                    var newBalance = currentBalance + recharge.amount;
                    console.log('新余额:', newBalance);
                    supabaseClient.from('profiles').update({balance: newBalance}).eq('id', recharge.user_id).then(function(updateRes) {
                        console.log('余额更新结果:', updateRes);
                        if (updateRes.error) {
                            alert('更新余额失败: ' + updateRes.error.message);
                        } else {
                            alert('已确认，余额已更新为 ¥' + newBalance);
                        }
                        loadAdminData();
                    });
                });
            } else {
                alert('已拒绝');
                loadAdminData();
            }
        });
    });
}

// ============================================
// 银行卡收款二维码生成
// ============================================
function generateBankQRCode() {
    var qrBox = document.getElementById('bankQRCode');
    if (!qrBox) return;

    // 直接显示银行收款码图片
    qrBox.innerHTML = '<img src="bank-qr.jpg" alt="收款码" style="width:100%;max-width:200px;border-radius:8px;">';
}

// ============================================
// 页面加载初始化
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // 初始化语言
    var savedLang = localStorage.getItem('selectedLang') || 'zh';
    applyLanguage(savedLang);

    // 语言按钮
    var langBtns = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < langBtns.length; i++) {
        langBtns[i].addEventListener('click', function(e) {
            e.preventDefault();
            applyLanguage(this.getAttribute('data-lang'));
            // 语言切换后更新银行信息和二维码
            updatePaymentInfo();
            generateBankQRCode();
        });
    }

    // 导航链接
    var navLinks = document.querySelectorAll('[data-page]');
    for (var j = 0; j < navLinks.length; j++) {
        navLinks[j].addEventListener('click', function(e) {
            e.preventDefault();
            showPage(this.getAttribute('data-page'));
        });
    }

    // 登录表单
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // 注册表单
    var registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }

    // 充值选项
    var options = document.querySelectorAll('.recharge-option');
    for (var k = 0; k < options.length; k++) {
        options[k].addEventListener('click', function() {
            for (var m = 0; m < options.length; m++) options[m].classList.remove('selected');
            this.classList.add('selected');
            selectedAmount = parseInt(this.getAttribute('data-amount'));
            // 更新金额显示
            updateSelectedAmountDisplay();
        });
    }

    // 文件上传
    var fileInput = document.getElementById('proofFile');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files[0]) document.getElementById('fileName').textContent = this.files[0].name;
        });
    }

    // 生成银行卡收款二维码
    generateBankQRCode();

    // 初始化金额显示
    updateSelectedAmountDisplay();

    // 初始化 Supabase（已通过本地 supabase.min.js 加载）
    if (typeof window.supabase !== 'undefined' && typeof CONFIG !== 'undefined' && CONFIG.SUPABASE_URL) {
        try {
            supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false
                }
            });
            console.log('Supabase 初始化成功');
            supabaseClient.auth.getSession().then(function(res) {
                if (res.data.session && res.data.session.user) {
                    currentUser = res.data.session.user;
                    loadUserProfile().then(function() {
                        updateNavVisibility();
                    });
                } else {
                    updateNavVisibility();
                }
            });
        } catch(e) {
            console.error('Supabase初始化失败', e);
            updateNavVisibility();
        }
    } else {
        updateNavVisibility();
    }
});
