'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Language = 'en' | 'ru' | 'zh'

// ═══════════════════════════════════════════════════════════════
// Translations Dictionary
// ═══════════════════════════════════════════════════════════════

const translations = {
  // ════════════════════════════════════════════════════════════
  // NAVIGATION
  // ════════════════════════════════════════════════════════════
  'nav.home': {
    en: 'Home',
    ru: 'Главная',
    zh: '首页',
  },
  'nav.events': {
    en: 'Events',
    ru: 'События',
    zh: '活动',
  },
  'nav.channels': {
    en: 'Channels',
    ru: 'Каналы',
    zh: '频道',
  },
  'nav.plans': {
    en: 'Plans',
    ru: 'Тарифы',
    zh: '套餐',
  },
  'nav.profile': {
    en: 'Profile',
    ru: 'Профиль',
    zh: '个人资料',
  },

  // ════════════════════════════════════════════════════════════
  // HOME PAGE
  // ════════════════════════════════════════════════════════════
  'home.newEvent': {
    en: 'New Event',
    ru: 'Новое событие',
    zh: '新活动',
  },
  'home.launchNow': {
    en: 'Launch now',
    ru: 'Запустить',
    zh: '立即发起',
  },
  'home.myEvents': {
    en: 'My Events',
    ru: 'Мои события',
    zh: '我的活动',
  },
  'home.viewAll': {
    en: 'View all',
    ru: 'Смотреть все',
    zh: '查看全部',
  },
  'home.myChannels': {
    en: 'My Channels',
    ru: 'Мои каналы',
    zh: '我的频道',
  },
  'home.manage': {
    en: 'Manage',
    ru: 'Управление',
    zh: '管理',
  },
  'home.plans': {
    en: 'Plans',
    ru: 'Тарифы',
    zh: '套餐',
  },
  'home.welcome': {
    en: 'Welcome',
    ru: 'Добро пожаловать',
    zh: '欢迎',
  },
  'home.subtitle': {
    en: 'Track your activity rewards',
    ru: 'Отслеживайте награды за активность',
    zh: '跟踪活动奖励',
  },
  'home.level': {
    en: 'Level',
    ru: 'Уровень',
    zh: '等级',
  },
  'home.quickActions': {
    en: 'Quick Actions',
    ru: 'Быстрые действия',
    zh: '快速操作',
  },
  'home.yourJourney': {
    en: 'Your Journey',
    ru: 'Ваш путь',
    zh: '您的旅程',
  },
  'home.stats': {
    en: 'Statistics',
    ru: 'Статистика',
    zh: '统计',
  },
  'home.events': {
    en: 'Events',
    ru: 'События',
    zh: '活动',
  },
  'home.participants': {
    en: 'Participants',
    ru: 'Участники',
    zh: '参与者',
  },
  'home.engagement': {
    en: 'Engagement',
    ru: 'Вовлечение',
    zh: '参与度',
  },
  'home.upgradePlan': {
    en: 'Upgrade Plan',
    ru: 'Улучшить тариф',
    zh: '升级套餐',
  },
  'home.upgrade': {
    en: 'Upgrade',
    ru: 'Улучшить',
    zh: '升级',
  },
  'home.profile': {
    en: 'Profile',
    ru: 'Профиль',
    zh: '个人资料',
  },
  'home.yourStats': {
    en: 'Your stats',
    ru: 'Статистика',
    zh: '您的统计',
  },
  'home.activeEvents': {
    en: 'Active Events',
    ru: 'Активные события',
    zh: '进行中的活动',
  },
  'home.noActiveEvents': {
    en: 'No active events yet',
    ru: 'Пока нет активных событий',
    zh: '暂无进行中的活动',
  },
  'home.createFirst': {
    en: 'Create First Event',
    ru: 'Создать первое событие',
    zh: '创建首个活动',
  },
  'home.winners': {
    en: 'winners',
    ru: 'победителей',
    zh: '获胜者',
  },

  // ════════════════════════════════════════════════════════════
  // BANNERS
  // ════════════════════════════════════════════════════════════
  'banner.stayUpdated': {
    en: 'Stay Updated!',
    ru: 'Будь в курсе!',
    zh: '保持更新！',
  },
  'banner.getNews': {
    en: 'Get the latest news & tips in our channel',
    ru: 'Получай новости и советы в нашем канале',
    zh: '在我们的频道获取最新消息和技巧',
  },
  'banner.firstFree': {
    en: 'First Event Free',
    ru: 'Первое событие бесплатно',
    zh: '首个活动免费',
  },
  'banner.tryUnic': {
    en: 'Try UNIC with your channel today',
    ru: 'Попробуй UNIC для своего канала',
    zh: '今天就用UNIC试试您的频道',
  },
  'banner.gotQuestions': {
    en: 'Got questions?',
    ru: 'Есть вопросы?',
    zh: '有问题？',
  },
  'banner.reachOut': {
    en: 'Reach out to us anytime',
    ru: 'Свяжитесь с нами в любое время',
    zh: '随时联系我们',
  },

  // ════════════════════════════════════════════════════════════
  // PACKAGES
  // ════════════════════════════════════════════════════════════
  'packages.title': {
    en: 'Packages',
    ru: 'Тарифы',
    zh: '套餐',
  },
  'packages.subtitle': {
    en: 'Choose a plan to unlock all features',
    ru: 'Выберите план для доступа ко всем функциям',
    zh: '选择套餐解锁所有功能',
  },
  'packages.monthly': {
    en: 'Monthly',
    ru: 'Месячно',
    zh: '月付',
  },
  'packages.yearly': {
    en: 'Yearly',
    ru: 'Годовой',
    zh: '年付',
  },
  'packages.free': {
    en: 'Free',
    ru: 'Бесплатно',
    zh: '免费',
  },
  'packages.trial': {
    en: 'Trial',
    ru: 'Пробный',
    zh: '试用',
  },
  'packages.basic': {
    en: 'Basic',
    ru: 'Базовый',
    zh: '基础版',
  },
  'packages.advanced': {
    en: 'Advanced',
    ru: 'Продвинутый',
    zh: '高级版',
  },
  'packages.premium': {
    en: 'Premium',
    ru: 'Премиум',
    zh: '尊享版',
  },
  'packages.popular': {
    en: 'Popular',
    ru: 'Популярный',
    zh: '热门',
  },
  'packages.currentPlan': {
    en: 'Current Plan',
    ru: 'Текущий план',
    zh: '当前套餐',
  },
  'packages.startTrial': {
    en: 'Start Trial',
    ru: 'Начать пробный',
    zh: '开始试用',
  },
  'packages.subscribe': {
    en: 'Subscribe',
    ru: 'Подписаться',
    zh: '订阅',
  },
  'packages.contactSales': {
    en: 'Contact Sales',
    ru: 'Связаться с отделом продаж',
    zh: '联系销售',
  },
  'packages.perWeek': {
    en: '/week',
    ru: '/нед.',
    zh: '/周',
  },
  'packages.perMonth': {
    en: '/month',
    ru: '/мес.',
    zh: '/月',
  },
  'packages.perYear': {
    en: '/year',
    ru: '/год',
    zh: '/年',
  },

  // ════════════════════════════════════════════════════════════
  // FEATURES
  // ════════════════════════════════════════════════════════════
  'feature.demoEvent': {
    en: '1 demo event',
    ru: '1 демо-событие',
    zh: '1个演示活动',
  },
  'feature.upTo100': {
    en: 'Up to 100 participants',
    ru: 'До 100 участников',
    zh: '最多100位参与者',
  },
  'feature.basicAnalytics': {
    en: 'Basic analytics',
    ru: 'Базовая аналитика',
    zh: '基础分析',
  },
  'feature.eventsPerWeek': {
    en: '3 events per week',
    ru: '3 события в неделю',
    zh: '每周3个活动',
  },
  'feature.upTo1000': {
    en: 'Up to 1,000 participants',
    ru: 'До 1,000 участников',
    zh: '最多1,000位参与者',
  },
  'feature.allActivityTypes': {
    en: 'All activity types',
    ru: 'Все типы активности',
    zh: '所有活动类型',
  },
  'feature.prioritySupport': {
    en: 'Priority support',
    ru: 'Приоритетная поддержка',
    zh: '优先支持',
  },
  'feature.eventsPerMonth': {
    en: '10 events per month',
    ru: '10 событий в месяц',
    zh: '每月10个活动',
  },
  'feature.upTo5000': {
    en: 'Up to 5,000 participants',
    ru: 'До 5,000 участников',
    zh: '最多5,000位参与者',
  },
  'feature.extendedAnalytics': {
    en: 'Extended analytics',
    ru: 'Расширенная аналитика',
    zh: '扩展分析',
  },
  'feature.removeBadge': {
    en: 'Remove UNIC badge',
    ru: 'Убрать значок UNIC',
    zh: '移除UNIC徽章',
  },
  'feature.unlimitedEvents': {
    en: 'Unlimited events',
    ru: 'Неограниченно событий',
    zh: '无限活动',
  },
  'feature.upTo50000': {
    en: 'Up to 50,000 participants',
    ru: 'До 50,000 участников',
    zh: '最多50,000位参与者',
  },
  'feature.3channels': {
    en: '3 channels',
    ru: '3 канала',
    zh: '3个频道',
  },
  'feature.customBranding': {
    en: 'Custom branding',
    ru: 'Своя брендировка',
    zh: '自定义品牌',
  },
  'feature.apiAccess': {
    en: 'API access',
    ru: 'Доступ к API',
    zh: 'API访问',
  },
  'feature.everythingAdvanced': {
    en: 'Everything in Advanced',
    ru: 'Всё из Advanced',
    zh: '高级版全部功能',
  },
  'feature.unlimitedParticipants': {
    en: 'Unlimited participants',
    ru: 'Неограниченно участников',
    zh: '无限参与者',
  },
  'feature.10channels': {
    en: '10 channels',
    ru: '10 каналов',
    zh: '10个频道',
  },
  'feature.whiteLabel': {
    en: 'White label',
    ru: 'White label',
    zh: '白标',
  },
  'feature.dedicatedManager': {
    en: 'Dedicated manager',
    ru: 'Персональный менеджер',
    zh: '专属经理',
  },

  // ════════════════════════════════════════════════════════════
  // PROFILE
  // ════════════════════════════════════════════════════════════
  'profile.title': {
    en: 'Profile',
    ru: 'Профиль',
    zh: '个人资料',
  },
  'profile.stats': {
    en: 'Stats',
    ru: 'Статистика',
    zh: '统计',
  },
  'profile.totalEvents': {
    en: 'Total Events',
    ru: 'Всего событий',
    zh: '总活动数',
  },
  'profile.totalParticipants': {
    en: 'Total Participants',
    ru: 'Всего участников',
    zh: '总参与者',
  },
  'profile.giftsAwarded': {
    en: 'Gifts Awarded',
    ru: 'Выдано подарков',
    zh: '已发放礼物',
  },
  'profile.settings': {
    en: 'Settings',
    ru: 'Настройки',
    zh: '设置',
  },
  'profile.theme': {
    en: 'Theme',
    ru: 'Тема',
    zh: '主题',
  },
  'profile.language': {
    en: 'Language',
    ru: 'Язык',
    zh: '语言',
  },
  'profile.notifications': {
    en: 'Notifications',
    ru: 'Уведомления',
    zh: '通知',
  },
  'profile.referral': {
    en: 'Referral',
    ru: 'Рефералы',
    zh: '推荐',
  },
  'profile.inviteFriends': {
    en: 'Invite friends and earn bonuses',
    ru: 'Пригласите друзей и получите бонусы',
    zh: '邀请好友获得奖励',
  },
  'profile.copyLink': {
    en: 'Copy Link',
    ru: 'Скопировать',
    zh: '复制链接',
  },

  // ════════════════════════════════════════════════════════════
  // EVENTS
  // ════════════════════════════════════════════════════════════
  'events.title': {
    en: 'My Events',
    ru: 'Мои события',
    zh: '我的活动',
  },
  'events.create': {
    en: 'Create Event',
    ru: 'Создать событие',
    zh: '创建活动',
  },
  'events.noEvents': {
    en: 'No events yet',
    ru: 'Пока нет событий',
    zh: '暂无活动',
  },
  'events.createFirst': {
    en: 'Create your first event',
    ru: 'Создайте своё первое событие',
    zh: '创建您的第一个活动',
  },
  'events.active': {
    en: 'Active',
    ru: 'Активно',
    zh: '进行中',
  },
  'events.ended': {
    en: 'Ended',
    ru: 'Завершено',
    zh: '已结束',
  },
  'events.draft': {
    en: 'Draft',
    ru: 'Черновик',
    zh: '草稿',
  },

  // ════════════════════════════════════════════════════════════
  // NEW EVENT
  // ════════════════════════════════════════════════════════════
  'newEvent.title': {
    en: 'New Event',
    ru: 'Новое событие',
    zh: '新活动',
  },
  'newEvent.selectChannel': {
    en: 'Select Channel',
    ru: 'Выберите канал',
    zh: '选择频道',
  },
  'newEvent.addChannel': {
    en: 'Add New Channel',
    ru: 'Добавить новый канал',
    zh: '添加新频道',
  },
  'newEvent.duration': {
    en: 'Duration',
    ru: 'Длительность',
    zh: '持续时间',
  },
  'newEvent.activityType': {
    en: 'Activity Type',
    ru: 'Тип активности',
    zh: '活动类型',
  },
  'newEvent.reactions': {
    en: 'Reactions',
    ru: 'Реакции',
    zh: '反应',
  },
  'newEvent.comments': {
    en: 'Comments',
    ru: 'Комментарии',
    zh: '评论',
  },
  'newEvent.allActivity': {
    en: 'All Activity',
    ru: 'Вся активность',
    zh: '所有活动',
  },
  'newEvent.winners': {
    en: 'Number of Winners',
    ru: 'Количество победителей',
    zh: '获胜者数量',
  },
  'newEvent.launch': {
    en: 'Launch Event',
    ru: 'Запустить событие',
    zh: '发起活动',
  },
  'newEvent.next': {
    en: 'Next',
    ru: 'Далее',
    zh: '下一步',
  },
  'newEvent.back': {
    en: 'Back',
    ru: 'Назад',
    zh: '返回',
  },

  // ════════════════════════════════════════════════════════════
  // CHANNELS
  // ════════════════════════════════════════════════════════════
  'channels.title': {
    en: 'My Channels',
    ru: 'Мои каналы',
    zh: '我的频道',
  },
  'channels.add': {
    en: 'Add Channel',
    ru: 'Добавить канал',
    zh: '添加频道',
  },
  'channels.noChannels': {
    en: 'No channels connected',
    ru: 'Нет подключённых каналов',
    zh: '未连接频道',
  },
  'channels.connectFirst': {
    en: 'Connect your first channel',
    ru: 'Подключите свой первый канал',
    zh: '连接您的第一个频道',
  },
  'channels.subscribers': {
    en: 'subscribers',
    ru: 'подписчиков',
    zh: '订阅者',
  },
  'channels.verified': {
    en: 'Verified',
    ru: 'Подтверждён',
    zh: '已验证',
  },

  // ════════════════════════════════════════════════════════════
  // ONBOARDING
  // ════════════════════════════════════════════════════════════
  'onboarding.welcome': {
    en: 'Welcome to UNIC!',
    ru: 'Добро пожаловать в UNIC!',
    zh: '欢迎来到UNIC！',
  },
  'onboarding.welcomeDesc': {
    en: "Hey! I'm your guide. Let's take a quick tour!",
    ru: 'Привет! Я твой гид. Давай пройдём быстрый тур!',
    zh: '嗨！我是您的向导。让我们快速浏览一下！',
  },
  'onboarding.howItWorks': {
    en: 'How it works',
    ru: 'Как это работает',
    zh: '如何运作',
  },
  'onboarding.howItWorksDesc': {
    en: 'Create engagement events. Subscribers earn points. Top users win Telegram Gifts!',
    ru: 'Создавайте события. Подписчики зарабатывают очки. Лучшие получают Telegram Gifts!',
    zh: '创建互动活动。订阅者赚取积分。顶级用户赢得Telegram礼物！',
  },
  'onboarding.letsGo': {
    en: "Let's go!",
    ru: 'Поехали!',
    zh: '开始吧！',
  },
  'onboarding.getStarted': {
    en: 'Get Started',
    ru: 'Начать',
    zh: '开始使用',
  },
  'onboarding.next': {
    en: 'Next',
    ru: 'Далее',
    zh: '下一步',
  },
  'onboarding.skip': {
    en: 'Skip',
    ru: 'Пропустить',
    zh: '跳过',
  },

  // ════════════════════════════════════════════════════════════
  // THEME
  // ════════════════════════════════════════════════════════════
  'theme.light': {
    en: 'Light',
    ru: 'Светлая',
    zh: '浅色',
  },
  'theme.dark': {
    en: 'Dark',
    ru: 'Тёмная',
    zh: '深色',
  },
  'theme.system': {
    en: 'System',
    ru: 'Системная',
    zh: '跟随系统',
  },

  // ════════════════════════════════════════════════════════════
  // COMMON
  // ════════════════════════════════════════════════════════════
  'common.loading': {
    en: 'Loading...',
    ru: 'Загрузка...',
    zh: '加载中...',
  },
  'common.error': {
    en: 'Something went wrong',
    ru: 'Что-то пошло не так',
    zh: '出了点问题',
  },
  'common.retry': {
    en: 'Retry',
    ru: 'Повторить',
    zh: '重试',
  },
  'common.save': {
    en: 'Save',
    ru: 'Сохранить',
    zh: '保存',
  },
  'common.cancel': {
    en: 'Cancel',
    ru: 'Отмена',
    zh: '取消',
  },
  'common.confirm': {
    en: 'Confirm',
    ru: 'Подтвердить',
    zh: '确认',
  },
  'common.delete': {
    en: 'Delete',
    ru: 'Удалить',
    zh: '删除',
  },
  'common.edit': {
    en: 'Edit',
    ru: 'Редактировать',
    zh: '编辑',
  },
  'common.copied': {
    en: 'Copied!',
    ru: 'Скопировано!',
    zh: '已复制！',
  },
  'common.tryAgain': {
    en: 'Try Again',
    ru: 'Попробовать снова',
    zh: '重试',
  },
  'common.continue': {
    en: 'Continue',
    ru: 'Продолжить',
    zh: '继续',
  },
  'common.add': {
    en: 'Add',
    ru: 'Добавить',
    zh: '添加',
  },
  'common.adding': {
    en: 'Adding...',
    ru: 'Добавление...',
    zh: '添加中...',
  },

  // ════════════════════════════════════════════════════════════
  // EVENTS PAGE
  // ════════════════════════════════════════════════════════════
  'events.newEvent': {
    en: '+ New Event',
    ru: '+ Новое событие',
    zh: '+ 新活动',
  },
  'events.errorLoading': {
    en: 'Error loading events',
    ru: 'Ошибка загрузки событий',
    zh: '加载活动出错',
  },
  'events.createToEngage': {
    en: 'Create your first event to engage your audience',
    ru: 'Создайте своё первое событие для вовлечения аудитории',
    zh: '创建首个活动以吸引您的受众',
  },
  'events.channel': {
    en: 'Channel',
    ru: 'Канал',
    zh: '频道',
  },
  'events.winners': {
    en: 'winners',
    ru: 'победителей',
    zh: '获胜者',
  },
  'events.pending': {
    en: 'Pending',
    ru: 'Ожидание',
    zh: '待定',
  },
  'events.completed': {
    en: 'Completed',
    ru: 'Завершено',
    zh: '已完成',
  },
  'events.cancelled': {
    en: 'Cancelled',
    ru: 'Отменено',
    zh: '已取消',
  },
  'events.participants': {
    en: 'Participants',
    ru: 'Участников',
    zh: '参与者',
  },
  'events.reactionsOnly': {
    en: 'Reactions only',
    ru: 'Только реакции',
    zh: '仅反应',
  },
  'events.commentsOnly': {
    en: 'Comments only',
    ru: 'Только комментарии',
    zh: '仅评论',
  },
  'events.today': {
    en: 'Today',
    ru: 'Сегодня',
    zh: '今天',
  },
  'events.yesterday': {
    en: 'Yesterday',
    ru: 'Вчера',
    zh: '昨天',
  },
  'events.daysAgo': {
    en: 'days ago',
    ru: 'дней назад',
    zh: '天前',
  },

  // ════════════════════════════════════════════════════════════
  // CHANNELS PAGE
  // ════════════════════════════════════════════════════════════
  'channels.addChannel': {
    en: '+ Add Channel',
    ru: '+ Добавить канал',
    zh: '+ 添加频道',
  },
  'channels.loading': {
    en: 'Loading channels...',
    ru: 'Загрузка каналов...',
    zh: '加载频道中...',
  },
  'channels.errorLoading': {
    en: 'Error loading channels',
    ru: 'Ошибка загрузки каналов',
    zh: '加载频道出错',
  },
  'channels.howToConnect': {
    en: 'How to connect a channel',
    ru: 'Как подключить канал',
    zh: '如何连接频道',
  },
  'channels.step1': {
    en: 'Add @UnicBot as admin to your channel',
    ru: 'Добавьте @UnicBot как админа в канал',
    zh: '将@UnicBot添加为频道管理员',
  },
  'channels.step2': {
    en: 'Click "Add Channel" and enter channel username',
    ru: 'Нажмите "Добавить канал" и введите username',
    zh: '点击"添加频道"并输入频道用户名',
  },
  'channels.step3': {
    en: 'Bot will verify admin rights automatically',
    ru: 'Бот автоматически проверит права админа',
    zh: '机器人将自动验证管理员权限',
  },
  'channels.noChannelsYet': {
    en: 'No channels yet',
    ru: 'Пока нет каналов',
    zh: '暂无频道',
  },
  'channels.connectFirstChannel': {
    en: 'Connect your first Telegram channel to start creating events',
    ru: 'Подключите свой первый Telegram канал для создания событий',
    zh: '连接您的第一个Telegram频道以开始创建活动',
  },
  'channels.pending': {
    en: 'Pending',
    ru: 'Ожидание',
    zh: '待验证',
  },
  'channels.channelUsername': {
    en: 'Channel Username',
    ru: 'Username канала',
    zh: '频道用户名',
  },
  'channels.confirmDelete': {
    en: 'Are you sure you want to remove this channel?',
    ru: 'Вы уверены, что хотите удалить этот канал?',
    zh: '确定要删除此频道吗？',
  },

  // ════════════════════════════════════════════════════════════
  // NEW EVENT PAGE
  // ════════════════════════════════════════════════════════════
  'newEvent.selectChannelDesc': {
    en: 'Choose which channel to run the event in',
    ru: 'Выберите канал для проведения события',
    zh: '选择要举办活动的频道',
  },
  'newEvent.connectedChannels': {
    en: 'Connected Channels',
    ru: 'Подключённые каналы',
    zh: '已连接的频道',
  },
  'newEvent.noChannelsConnected': {
    en: 'No channels connected yet',
    ru: 'Пока нет подключённых каналов',
    zh: '暂无连接的频道',
  },
  'newEvent.ensureAdmin': {
    en: 'Make sure @UnicBot is added as admin to your channel',
    ru: 'Убедитесь, что @UnicBot добавлен как админ канала',
    zh: '确保@UnicBot已被添加为频道管理员',
  },
  'newEvent.eventSettings': {
    en: 'Event Settings',
    ru: 'Настройки события',
    zh: '活动设置',
  },
  'newEvent.configureEvent': {
    en: 'Configure how the event will work',
    ru: 'Настройте параметры события',
    zh: '配置活动运行方式',
  },
  'newEvent.confirmLaunch': {
    en: 'Confirm & Launch',
    ru: 'Подтвердить и запустить',
    zh: '确认并发起',
  },
  'newEvent.reviewSettings': {
    en: 'Review your event settings',
    ru: 'Проверьте настройки события',
    zh: '检查您的活动设置',
  },
  'newEvent.eventSummary': {
    en: 'Event Summary',
    ru: 'Сводка события',
    zh: '活动摘要',
  },
  'newEvent.channel': {
    en: 'Channel',
    ru: 'Канал',
    zh: '频道',
  },
  'newEvent.activity': {
    en: 'Activity',
    ru: 'Активность',
    zh: '活动类型',
  },
  'newEvent.pointsSystem': {
    en: 'Points System',
    ru: 'Система очков',
    zh: '积分系统',
  },
  'newEvent.reactionPts': {
    en: 'Reaction = 1 point',
    ru: 'Реакция = 1 очко',
    zh: '反应 = 1分',
  },
  'newEvent.commentPts': {
    en: 'Comment = 3 points',
    ru: 'Комментарий = 3 очка',
    zh: '评论 = 3分',
  },
  'newEvent.replyPts': {
    en: 'Reply = 2 points',
    ru: 'Ответ = 2 очка',
    zh: '回复 = 2分',
  },
  'newEvent.total': {
    en: 'Total',
    ru: 'Итого',
    zh: '总计',
  },
  'newEvent.firstFree': {
    en: 'First event is free',
    ru: 'Первое событие бесплатно',
    zh: '首个活动免费',
  },
  'newEvent.launching': {
    en: 'Launching...',
    ru: 'Запуск...',
    zh: '发起中...',
  },
  'newEvent.24h': {
    en: '24 hours',
    ru: '24 часа',
    zh: '24小时',
  },
  'newEvent.48h': {
    en: '48 hours',
    ru: '48 часов',
    zh: '48小时',
  },
  'newEvent.72h': {
    en: '72 hours',
    ru: '72 часа',
    zh: '72小时',
  },
  'newEvent.7d': {
    en: '7 days',
    ru: '7 дней',
    zh: '7天',
  },

  // ════════════════════════════════════════════════════════════
  // LEADERBOARD PAGE
  // ════════════════════════════════════════════════════════════
  'leaderboard.eventCompleted': {
    en: 'Event Completed',
    ru: 'Событие завершено',
    zh: '活动已结束',
  },
  'leaderboard.eventLeaderboard': {
    en: 'Event Leaderboard',
    ru: 'Таблица лидеров',
    zh: '排行榜',
  },
  'leaderboard.participants': {
    en: 'participants',
    ru: 'участников',
    zh: '参与者',
  },
  'leaderboard.timeRemaining': {
    en: 'Time Remaining',
    ru: 'Осталось времени',
    zh: '剩余时间',
  },
  'leaderboard.yourPosition': {
    en: 'Your Position',
    ru: 'Ваша позиция',
    zh: '您的排名',
  },
  'leaderboard.pts': {
    en: 'pts',
    ru: 'очков',
    zh: '分',
  },
  'leaderboard.reactions': {
    en: 'reactions',
    ru: 'реакций',
    zh: '反应',
  },
  'leaderboard.comments': {
    en: 'comments',
    ru: 'комментариев',
    zh: '评论',
  },
  'leaderboard.joinPrompt': {
    en: 'Start reacting and commenting to join the leaderboard!',
    ru: 'Начните ставить реакции и комментировать, чтобы попасть в таблицу!',
    zh: '开始点赞和评论以加入排行榜！',
  },
  'leaderboard.scoringRules': {
    en: 'Reaction = 1 pt • Comment = 3 pts • Reply = 2 pts',
    ru: 'Реакция = 1 • Комментарий = 3 • Ответ = 2',
    zh: '反应=1分 • 评论=3分 • 回复=2分',
  },
  'leaderboard.winners': {
    en: 'Winners',
    ru: 'Победители',
    zh: '获胜者',
  },
  'leaderboard.finalStandings': {
    en: 'Final Standings',
    ru: 'Итоговые результаты',
    zh: '最终排名',
  },
  'leaderboard.topParticipants': {
    en: 'Top Participants',
    ru: 'Лучшие участники',
    zh: '顶级参与者',
  },
  'leaderboard.noParticipants': {
    en: 'No participants yet',
    ru: 'Пока нет участников',
    zh: '暂无参与者',
  },
  'leaderboard.prizes': {
    en: 'Prizes',
    ru: 'Призы',
    zh: '奖品',
  },
  'leaderboard.telegramGifts': {
    en: 'Telegram Gifts',
    ru: 'Telegram Gifts',
    zh: 'Telegram礼物',
  },
  'leaderboard.topWillReceive': {
    en: 'participants will receive gifts',
    ru: 'участников получат подарки',
    zh: '位参与者将获得礼物',
  },
  'leaderboard.backToChannel': {
    en: 'Back to Channel',
    ru: 'Вернуться в канал',
    zh: '返回频道',
  },
  'leaderboard.eventNotFound': {
    en: 'Event not found',
    ru: 'Событие не найдено',
    zh: '未找到活动',
  },
  'leaderboard.ended': {
    en: 'Ended',
    ru: 'Завершено',
    zh: '已结束',
  },
  'leaderboard.anonymous': {
    en: 'Anonymous',
    ru: 'Аноним',
    zh: '匿名',
  },

  // ════════════════════════════════════════════════════════════
  // PROFILE PAGE
  // ════════════════════════════════════════════════════════════
  'profile.manageAccount': {
    en: 'Manage your account',
    ru: 'Управление аккаунтом',
    zh: '管理您的账户',
  },
  'profile.errorLoading': {
    en: 'Error loading profile',
    ru: 'Ошибка загрузки профиля',
    zh: '加载个人资料出错',
  },
  'profile.loadingProfile': {
    en: 'Loading profile...',
    ru: 'Загрузка профиля...',
    zh: '加载个人资料中...',
  },
  'profile.monthlyUsage': {
    en: 'Monthly Usage',
    ru: 'Месячное использование',
    zh: '月度使用情况',
  },
  'profile.eventsThisMonth': {
    en: 'Events this month',
    ru: 'Событий в этом месяце',
    zh: '本月活动',
  },
  'profile.channelsLimit': {
    en: 'Channels limit',
    ru: 'Лимит каналов',
    zh: '频道限制',
  },
  'profile.maxParticipants': {
    en: 'Max participants',
    ru: 'Макс. участников',
    zh: '最大参与者',
  },
  'profile.unlimited': {
    en: 'Unlimited',
    ru: 'Безлимит',
    zh: '无限制',
  },
  'profile.referralProgram': {
    en: 'Referral Program',
    ru: 'Реферальная программа',
    zh: '推荐计划',
  },
  'profile.inviteAndEarn': {
    en: 'Invite friends and earn bonus events!',
    ru: 'Пригласите друзей и получите бонусные события!',
    zh: '邀请好友获得额外活动！',
  },
  'profile.copy': {
    en: 'Copy',
    ru: 'Копировать',
    zh: '复制',
  },
  'profile.planExpires': {
    en: 'Plan expires',
    ru: 'План истекает',
    zh: '套餐到期',
  },
  'profile.upgradePlan': {
    en: 'Upgrade Plan',
    ru: 'Улучшить план',
    zh: '升级套餐',
  },
  'profile.managePlan': {
    en: 'Manage Plan',
    ru: 'Управление планом',
    zh: '管理套餐',
  },
  'profile.support': {
    en: 'Support',
    ru: 'Поддержка',
    zh: '支持',
  },
  'profile.privacy': {
    en: 'Privacy',
    ru: 'Конфиденциальность',
    zh: '隐私',
  },
  'profile.terms': {
    en: 'Terms',
    ru: 'Условия',
    zh: '条款',
  },

  // ════════════════════════════════════════════════════════════
  // TIERS
  // ════════════════════════════════════════════════════════════
  'tiers.newbie': {
    en: 'Newbie',
    ru: 'Новичок',
    zh: '新手',
  },
  'tiers.pro': {
    en: 'Pro',
    ru: 'Профи',
    zh: '专业',
  },
  'tiers.legend': {
    en: 'Legend',
    ru: 'Легенда',
    zh: '传奇',
  },
  'tiers.current': {
    en: 'Current',
    ru: 'Текущий',
    zh: '当前',
  },
  'tiers.events': {
    en: 'events',
    ru: 'событий',
    zh: '活动',
  },
} as const

export type TranslationKey = keyof typeof translations

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Load saved language or detect from Telegram
    const saved = localStorage.getItem('unic-language') as Language

    if (saved) {
      setLanguageState(saved)
    } else if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
      const tgLang = window.Telegram.WebApp.initDataUnsafe.user.language_code
      if (tgLang === 'ru') setLanguageState('ru')
      else if (tgLang === 'zh' || tgLang === 'zh-hans' || tgLang === 'zh-hant') setLanguageState('zh')
      else setLanguageState('en')
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('unic-language', lang)
  }

  const t = (key: TranslationKey): string => {
    const translation = translations[key]
    if (!translation) return key
    return translation[language] || translation.en
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export function useTranslation() {
  const { t, language } = useLanguage()
  return { t, language }
}
