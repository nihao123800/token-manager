// ============================================
// 多语言支持 - 中文/英文/越南语
// ============================================

const I18N = {
    // 中文
    zh: {
        // 通用
        site_name: 'AI Token 服务中心',
        loading: '加载中...',
        error: '出错了',
        success: '成功',
        cancel: '取消',
        confirm: '确认',
        save: '保存',
        delete: '删除',
        edit: '编辑',
        back: '返回',
        next: '下一步',
        submit: '提交',
        search: '搜索',
        
        // 导航
        nav_home: '首页',
        nav_dashboard: '控制台',
        nav_recharge: '充值',
        nav_api: '我的API',
        nav_history: '使用记录',
        nav_admin: '管理后台',
        nav_logout: '退出登录',
        
        // 首页
        home_title: '欢迎使用 AI Token 服务中心',
        home_subtitle: '高质量AI API中转服务',
        home_feature1_title: '稳定可靠',
        home_feature1_desc: '7x24小时不间断服务',
        home_feature2_title: '价格实惠',
        home_feature2_desc: '最具性价比的API服务',
        home_feature3_title: '安全快捷',
        home_feature3_desc: '数据加密，即时生效',
        get_started: '立即开始',
        
        // 登录/注册
        login_title: '用户登录',
        register_title: '用户注册',
        email: '邮箱',
        password: '密码',
        confirm_password: '确认密码',
        phone: '手机号',
        username: '用户名',
        login_button: '登录',
        register_button: '注册',
        forgot_password: '忘记密码？',
        no_account: '没有账号？',
        has_account: '已有账号？',
        go_register: '立即注册',
        go_login: '立即登录',
        
        // 控制台
        dashboard_title: '我的控制台',
        dashboard_my_api_key: '我的 API Key',
        balance: '账户余额',
        today_usage: '今日使用量',
        month_usage: '本月使用量',
        total_usage: '总使用量',
        unit_tokens: 'tokens',
        unit_yuan: '元',
        
        // API管理
        api_title: '我的API密钥',
        api_key: 'API密钥',
        api_create: '创建新密钥',
        api_delete: '删除密钥',
        api_status_active: '正常',
        api_status_disabled: '已禁用',
        api_copy: '复制',
        api_usage: '使用量',
        api_created: '创建时间',
        api_last_used: '最后使用',
        api_warning: '请妥善保管你的API密钥，不要泄露给他人',
        
        // 充值
        recharge_title: '账户充值',
        recharge_amount: '充值金额',
        recharge_method: '收款方式',
        recharge_bank: '银行卡转账',
        recharge_info: '请将金额转入以下账户',
        recharge_bank_name: '银行名称',
        recharge_account: '银行卡号',
        recharge_account_name: '账户姓名',
        recharge_branch: '开户支行',
        recharge_upload: '上传转账凭证',
        recharge_submit: '提交充值申请',
        recharge_qr_label: '扫码支付',
        recharge_qr_hint: '打开银行APP扫码支付',
        recharge_pending: '等待确认',
        recharge_success: '充值成功',
        recharge_failed: '充值失败',
        recharge_history: '充值记录',
        recharge_selected: '已选择金额：',
        
        // 使用记录
        history_title: '使用记录',
        history_date: '日期',
        history_tokens: 'Token使用量',
        history_api: 'API密钥',
        history_status: '状态',
        history_status_success: '成功',
        history_status_failed: '失败',
        history_model: '模型',
        history_input_hit: '输入(缓存命中)',
        history_input_miss: '输入(缓存未命中)',
        history_output: '输出',
        history_cost: '费用',
        history_price: '单价',
        
        // 管理后台
        admin_title: '管理后台',
        admin_users: '用户管理',
        admin_recharges: '充值管理',
        admin_api_keys: 'API密钥管理',
        admin_confirm: '确认到账',
        admin_reject: '拒绝',
        admin_user_count: '用户总数',
        admin_total_recharge: '总充值金额',
        admin_pending_recharge: '待确认充值',
        admin_record_usage: '录入用量',
        admin_select_user: '选择客户',
        admin_select_model: '选择模型',
        admin_input_cache_hit: '输入Token(缓存命中)',
        admin_input_cache_miss: '输入Token(缓存未命中)',
        admin_output_tokens: '输出Token',
        admin_calculate_cost: '计算费用',
        admin_submit_usage: '提交用量',
        admin_customer_management: '客户管理',
        admin_balance_warning: '余额预警阈值',
        admin_set_warning: '设置预警',
        admin_total_usage: '总用量',
        admin_total_cost: '总费用',
        admin_api_key_management: 'API Key管理',
        admin_add_master_key: '添加主Key',
        admin_key_name: 'Key名称',
        admin_key_value: 'API Key',
        admin_assigned_to: '已分配给',
        admin_assign_key: '分配Key',
        admin_unassign: '取消分配',
        admin_delete_key: '删除Key',
        admin_no_key_assigned: '暂未分配API Key，请联系管理员',
        
        // 语言切换
        lang_zh: '中文',
        lang_en: 'English',
        lang_vi: 'Tiếng Việt',
        
        // 消息提示
        msg_login_success: '登录成功',
        msg_register_success: '注册成功',
        msg_logout_success: '已退出登录',
        msg_recharge_submitted: '充值申请已提交，请等待确认',
        msg_recharge_confirmed: '充值已确认',
        msg_api_created: 'API密钥已创建',
        msg_api_deleted: 'API密钥已删除',
        msg_api_copied: 'API密钥已复制到剪贴板',
        msg_password_error: '两次输入的密码不一致',
        msg_email_exists: '该邮箱已注册',
        msg_invalid_email: '请输入有效的邮箱地址',
        msg_password_length: '密码至少需要6个字符',
        msg_fill_all: '请填写所有必填项',
        msg_upload_proof: '请上传转账凭证',
        msg_network_error: '网络错误，请稍后重试',
        msg_usage_recorded: '用量已录入',
        msg_balance_warning: '余额不足，请及时充值',
        msg_warning_set: '预警阈值已设置',
        
        // 二维码转账信息
        qr_transfer_info: '转账信息',
        qr_bank: '银行',
        qr_account: '卡号',
        qr_name: '姓名',
        qr_branch: '支行',
        qr_hint: '请转账后上传凭证提交充值',
        
        // 页脚
        footer_copyright: '© 2026 AI Token 服务中心',
        footer_contact: '联系我们'
    },
    
    // 英文
    en: {
        // General
        site_name: 'AI Token Service Center',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back',
        next: 'Next',
        submit: 'Submit',
        search: 'Search',
        
        // Navigation
        nav_home: 'Home',
        nav_dashboard: 'Dashboard',
        nav_recharge: 'Recharge',
        nav_api: 'My API',
        nav_history: 'History',
        nav_admin: 'Admin',
        nav_logout: 'Logout',
        
        // Home
        home_title: 'Welcome to AI Token Service Center',
        home_subtitle: 'High Quality AI API Relay Service',
        home_feature1_title: 'Stable & Reliable',
        home_feature1_desc: '24/7 Non-stop Service',
        home_feature2_title: 'Affordable',
        home_feature2_desc: 'Best Value API Service',
        home_feature3_title: 'Secure & Fast',
        home_feature3_desc: 'Encrypted Data, Instant Activation',
        get_started: 'Get Started',
        
        // Login/Register
        login_title: 'User Login',
        register_title: 'User Registration',
        email: 'Email',
        password: 'Password',
        confirm_password: 'Confirm Password',
        phone: 'Phone',
        username: 'Username',
        login_button: 'Login',
        register_button: 'Register',
        forgot_password: 'Forgot Password?',
        no_account: "Don't have an account?",
        has_account: 'Already have an account?',
        go_register: 'Register Now',
        go_login: 'Login Now',
        
        // Dashboard
        dashboard_title: 'My Dashboard',
        dashboard_my_api_key: 'My API Key',
        balance: 'Balance',
        today_usage: "Today's Usage",
        month_usage: 'Monthly Usage',
        total_usage: 'Total Usage',
        unit_tokens: 'tokens',
        unit_yuan: 'CNY',
        
        // API Management
        api_title: 'My API Keys',
        api_key: 'API Key',
        api_create: 'Create New Key',
        api_delete: 'Delete Key',
        api_status_active: 'Active',
        api_status_disabled: 'Disabled',
        api_copy: 'Copy',
        api_usage: 'Usage',
        api_created: 'Created',
        api_last_used: 'Last Used',
        api_warning: 'Keep your API key secure and do not share it',
        
        // Recharge
        recharge_title: 'Account Recharge',
        recharge_amount: 'Amount',
        recharge_method: 'Payment Method',
        recharge_bank: 'Bank Transfer',
        recharge_info: 'Please transfer to the following account',
        recharge_bank_name: 'Bank Name',
        recharge_account: 'Account Number',
        recharge_account_name: 'Account Holder',
        recharge_branch: 'Branch',
        recharge_upload: 'Upload Proof of Transfer',
        recharge_submit: 'Submit Recharge Request',
        recharge_qr_label: 'Scan to Pay',
        recharge_qr_hint: 'Open banking app to scan',
        recharge_pending: 'Pending Confirmation',
        recharge_success: 'Recharge Successful',
        recharge_failed: 'Recharge Failed',
        recharge_history: 'Recharge History',
        recharge_selected: 'Selected Amount: ',
        
        // Usage History
        history_title: 'Usage History',
        history_date: 'Date',
        history_tokens: 'Token Usage',
        history_api: 'API Key',
        history_status: 'Status',
        history_status_success: 'Success',
        history_status_failed: 'Failed',
        history_model: 'Model',
        history_input_hit: 'Input (Cache Hit)',
        history_input_miss: 'Input (Cache Miss)',
        history_output: 'Output',
        history_cost: 'Cost',
        history_price: 'Unit Price',
        
        // Admin
        admin_title: 'Admin Panel',
        admin_users: 'User Management',
        admin_recharges: 'Recharge Management',
        admin_api_keys: 'API Key Management',
        admin_confirm: 'Confirm Payment',
        admin_reject: 'Reject',
        admin_user_count: 'Total Users',
        admin_total_recharge: 'Total Recharge',
        admin_pending_recharge: 'Pending Recharge',
        admin_record_usage: 'Record Usage',
        admin_select_user: 'Select Customer',
        admin_select_model: 'Select Model',
        admin_input_cache_hit: 'Input Tokens (Cache Hit)',
        admin_input_cache_miss: 'Input Tokens (Cache Miss)',
        admin_output_tokens: 'Output Tokens',
        admin_calculate_cost: 'Calculate Cost',
        admin_submit_usage: 'Submit Usage',
        admin_customer_management: 'Customer Management',
        admin_balance_warning: 'Balance Warning Threshold',
        admin_set_warning: 'Set Warning',
        admin_total_usage: 'Total Usage',
        admin_total_cost: 'Total Cost',
        admin_api_key_management: 'API Key Management',
        admin_add_master_key: 'Add Master Key',
        admin_key_name: 'Key Name',
        admin_key_value: 'API Key',
        admin_assigned_to: 'Assigned To',
        admin_assign_key: 'Assign Key',
        admin_unassign: 'Unassign',
        admin_delete_key: 'Delete Key',
        admin_no_key_assigned: 'No API key assigned yet, please contact admin',
        
        // Language
        lang_zh: '中文',
        lang_en: 'English',
        lang_vi: 'Tiếng Việt',
        
        // Messages
        msg_login_success: 'Login successful',
        msg_register_success: 'Registration successful',
        msg_logout_success: 'Logged out successfully',
        msg_recharge_submitted: 'Recharge request submitted, please wait for confirmation',
        msg_recharge_confirmed: 'Recharge confirmed',
        msg_api_created: 'API key created',
        msg_api_deleted: 'API key deleted',
        msg_api_copied: 'API key copied to clipboard',
        msg_password_error: 'Passwords do not match',
        msg_email_exists: 'Email already registered',
        msg_invalid_email: 'Please enter a valid email',
        msg_password_length: 'Password must be at least 6 characters',
        msg_fill_all: 'Please fill in all required fields',
        msg_upload_proof: 'Please upload proof of transfer',
        msg_network_error: 'Network error, please try again later',
        msg_usage_recorded: 'Usage recorded',
        msg_balance_warning: 'Low balance, please recharge',
        msg_warning_set: 'Warning threshold set',
        
        // QR Code Transfer Info
        qr_transfer_info: 'Transfer Info',
        qr_bank: 'Bank',
        qr_account: 'Account',
        qr_name: 'Name',
        qr_branch: 'Branch',
        qr_hint: 'Please upload proof after transfer',
        
        // Footer
        footer_copyright: '© 2026 AI Token Service Center',
        footer_contact: 'Contact Us'
    },
    
    // 越南语
    vi: {
        // Chung
        site_name: 'Trung Tâm Dịch Vụ AI Token',
        loading: 'Đang tải...',
        error: 'Lỗi',
        success: 'Thành công',
        cancel: 'Hủy',
        confirm: 'Xác nhận',
        save: 'Lưu',
        delete: 'Xóa',
        edit: 'Sửa',
        back: 'Quay lại',
        next: 'Tiếp theo',
        submit: 'Gửi',
        search: 'Tìm kiếm',
        
        // Điều hướng
        nav_home: 'Trang chủ',
        nav_dashboard: 'Bảng điều khiển',
        nav_recharge: 'Nạp tiền',
        nav_api: 'API của tôi',
        nav_history: 'Lịch sử',
        nav_admin: 'Quản trị',
        nav_logout: 'Đăng xuất',
        
        // Trang chủ
        home_title: 'Chào mừng đến với Trung Tâm Dịch Vụ AI Token',
        home_subtitle: 'Dịch Vụ Trung Chuyển API AI Chất Lượng Cao',
        home_feature1_title: 'Ổn Định & Đáng Tin',
        home_feature1_desc: 'Dịch Vụ 24/7 Không Gián Đoạn',
        home_feature2_title: 'Giá Hợp Lý',
        home_feature2_desc: 'Dịch Vụ API Tốt Nhất',
        home_feature3_title: 'An Toàn & Nhanh Chóng',
        home_feature3_desc: 'Mã Hóa Dữ Liệu, Kích Hoạt Ngay Lập Tức',
        get_started: 'Bắt Đầu Ngay',
        
        // Đăng nhập/Đăng ký
        login_title: 'Đăng Nhập',
        register_title: 'Đăng Ký Tài Khoản',
        email: 'Email',
        password: 'Mật khẩu',
        confirm_password: 'Xác nhận mật khẩu',
        phone: 'Số điện thoại',
        username: 'Tên người dùng',
        login_button: 'Đăng nhập',
        register_button: 'Đăng ký',
        forgot_password: 'Quên mật khẩu?',
        no_account: 'Chưa có tài khoản?',
        has_account: 'Đã có tài khoản?',
        go_register: 'Đăng ký ngay',
        go_login: 'Đăng nhập ngay',
        
        // Bảng điều khiển
        dashboard_title: 'Bảng Điều Khiển Của Tôi',
        dashboard_my_api_key: 'API Key Của Tôi',
        balance: 'Số dư',
        today_usage: 'Sử dụng hôm nay',
        month_usage: 'Sử dụng tháng này',
        total_usage: 'Tổng sử dụng',
        unit_tokens: 'tokens',
        unit_yuan: 'CNY',
        
        // Quản lý API
        api_title: 'Khóa API Của Tôi',
        api_key: 'Khóa API',
        api_create: 'Tạo khóa mới',
        api_delete: 'Xóa khóa',
        api_status_active: 'Hoạt động',
        api_status_disabled: 'Đã vô hiệu hóa',
        api_copy: 'Sao chép',
        api_usage: 'Lượt sử dụng',
        api_created: 'Ngày tạo',
        api_last_used: 'Lần sử dụng cuối',
        api_warning: 'Hãy bảo mật khóa API và không chia sẻ cho người khác',
        
        // Nạp tiền
        recharge_title: 'Nạp Tiền Tài Khoản',
        recharge_amount: 'Số tiền',
        recharge_method: 'Phương thức thanh toán',
        recharge_bank: 'Chuyển khoản ngân hàng',
        recharge_info: 'Vui lòng chuyển khoản vào tài khoản sau',
        recharge_bank_name: 'Tên ngân hàng',
        recharge_account: 'Số tài khoản',
        recharge_account_name: 'Tên chủ tài khoản',
        recharge_branch: 'Chi nhánh',
        recharge_upload: 'Tải lên bằng chứng chuyển khoản',
        recharge_submit: 'Gửi yêu cầu nạp tiền',
        recharge_qr_label: 'Quét mã thanh toán',
        recharge_qr_hint: 'Mở app ngân hàng để quét',
        recharge_pending: 'Đang chờ xác nhận',
        recharge_success: 'Nạp tiền thành công',
        recharge_failed: 'Nạp tiền thất bại',
        recharge_history: 'Lịch sử nạp tiền',
        recharge_selected: 'Số tiền đã chọn: ',
        
        // Lịch sử sử dụng
        history_title: 'Lịch Sử Sử Dụng',
        history_date: 'Ngày',
        history_tokens: 'Lượt sử dụng Token',
        history_api: 'Khóa API',
        history_status: 'Trạng thái',
        history_status_success: 'Thành công',
        history_status_failed: 'Thất bại',
        history_model: 'Mô hình',
        history_input_hit: 'Đầu vào (Cache Hit)',
        history_input_miss: 'Đầu vào (Cache Miss)',
        history_output: 'Đầu ra',
        history_cost: 'Chi phí',
        history_price: 'Đơn giá',
        
        // Quản trị
        admin_title: 'Bảng Quản Trị',
        admin_users: 'Quản lý người dùng',
        admin_recharges: 'Quản lý nạp tiền',
        admin_api_keys: 'Quản lý khóa API',
        admin_confirm: 'Xác nhận thanh toán',
        admin_reject: 'Từ chối',
        admin_user_count: 'Tổng người dùng',
        admin_total_recharge: 'Tổng tiền nạp',
        admin_pending_recharge: 'Nạp tiền chờ xác nhận',
        admin_record_usage: 'Ghi nhận sử dụng',
        admin_select_user: 'Chọn khách hàng',
        admin_select_model: 'Chọn mô hình',
        admin_input_cache_hit: 'Token đầu vào (Cache Hit)',
        admin_input_cache_miss: 'Token đầu vào (Cache Miss)',
        admin_output_tokens: 'Token đầu ra',
        admin_calculate_cost: 'Tính chi phí',
        admin_submit_usage: 'Gửi sử dụng',
        admin_customer_management: 'Quản lý khách hàng',
        admin_balance_warning: 'Ngưỡng cảnh báo số dư',
        admin_set_warning: 'Đặt cảnh báo',
        admin_total_usage: 'Tổng sử dụng',
        admin_total_cost: 'Tổng chi phí',
        admin_api_key_management: 'Quản lý API Key',
        admin_add_master_key: 'Thêm Key chính',
        admin_key_name: 'Tên Key',
        admin_key_value: 'API Key',
        admin_assigned_to: 'Đã phân bổ cho',
        admin_assign_key: 'Phân bổ Key',
        admin_unassign: 'Hủy phân bổ',
        admin_delete_key: 'Xóa Key',
        admin_no_key_assigned: 'Chưa phân bổ API Key, vui lòng liên hệ quản trị viên',
        
        // Ngôn ngữ
        lang_zh: '中文',
        lang_en: 'English',
        lang_vi: 'Tiếng Việt',
        
        // Thông báo
        msg_login_success: 'Đăng nhập thành công',
        msg_register_success: 'Đăng ký thành công',
        msg_logout_success: 'Đăng xuất thành công',
        msg_recharge_submitted: 'Yêu cầu nạp tiền đã gửi, vui lòng chờ xác nhận',
        msg_recharge_confirmed: 'Nạp tiền đã được xác nhận',
        msg_api_created: 'Khóa API đã được tạo',
        msg_api_deleted: 'Khóa API đã bị xóa',
        msg_api_copied: 'Khóa API đã được sao chép',
        msg_password_error: 'Mật khẩu không khớp',
        msg_email_exists: 'Email đã được đăng ký',
        msg_invalid_email: 'Vui lòng nhập email hợp lệ',
        msg_password_length: 'Mật khẩu phải có ít nhất 6 ký tự',
        msg_fill_all: 'Vui lòng điền đầy đủ thông tin',
        msg_upload_proof: 'Vui lòng tải lên bằng chứng chuyển khoản',
        msg_network_error: 'Lỗi mạng, vui lòng thử lại sau',
        msg_usage_recorded: 'Đã ghi nhận sử dụng',
        msg_balance_warning: 'Số dư thấp, vui lòng nạp tiền',
        msg_warning_set: 'Đã đặt ngưỡng cảnh báo',
        
        // Mã QR thông tin chuyển khoản
        qr_transfer_info: 'Thông tin chuyển khoản',
        qr_bank: 'Ngân hàng',
        qr_account: 'Số tài khoản',
        qr_name: 'Tên',
        qr_branch: 'Chi nhánh',
        qr_hint: 'Vui lòng tải lên chứng từ sau khi chuyển khoản',
        
        // Footer
        footer_copyright: '© 2026 Trung Tâm Dịch Vụ AI Token',
        footer_contact: 'Liên hệ'
    }
};

// 当前语言
let currentLang = localStorage.getItem('lang') || CONFIG.DEFAULT_LANG;

// 获取翻译文本
function t(key) {
    return I18N[currentLang][key] || I18N[CONFIG.DEFAULT_LANG][key] || key;
}

// 切换语言
function setLang(lang) {
    if (CONFIG.SUPPORTED_LANGS.includes(lang)) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        // 触发语言更新事件
        window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
    }
}

// 获取当前语言
function getLang() {
    return currentLang;
}
