import { useTranslation } from 'react-i18next';

export function useTranslations() {
  const { t, i18n } = useTranslation();

  const common = {
    loading: t('common.loading'),
    error: t('common.error'),
    success: t('common.success'),
    cancel: t('common.cancel'),
    save: t('common.save'),
    delete: t('common.delete'),
    edit: t('common.edit'),
    submit: t('common.submit'),
    back: t('common.back'),
    next: t('common.next'),
    previous: t('common.previous'),
    close: t('common.close'),
    confirm: t('common.confirm'),
    yes: t('common.yes'),
    no: t('common.no'),
    ok: t('common.ok'),
    retry: t('common.retry'),
    refresh: t('common.refresh'),
    search: t('common.search'),
    filter: t('common.filter'),
    sort: t('common.sort'),
    view: t('common.view'),
    details: t('common.details'),
    more: t('common.more'),
    less: t('common.less'),
  };

  const navigation = {
    home: t('navigation.home'),
    history: t('navigation.history'),
    tracking: t('navigation.tracking'),
    request: t('navigation.request'),
    profile: t('navigation.profile'),
  };

  const auth = {
    login: t('auth.login'),
    logout: t('auth.logout'),
    signup: t('auth.signup'),
    welcome: t('auth.welcome'),
    unauthorized: t('auth.unauthorized'),
    accessDenied: t('auth.accessDenied'),
    sessionExpired: t('auth.sessionExpired'),
  };

  const home = {
    title: t('home.title'),
    subtitle: t('home.subtitle'),
    totalMiles: t('home.totalMiles'),
    availableMiles: t('home.availableMiles'),
    expiringMiles: t('home.expiringMiles'),
    recentActivity: t('home.recentActivity'),
    quickActions: t('home.quickActions'),
    requestMiles: t('home.requestMiles'),
    viewHistory: t('home.viewHistory'),
    trackRequest: t('home.trackRequest'),
  };

  const profile = {
    title: t('profile.title'),
    personalInfo: t('profile.personalInfo'),
    membershipInfo: t('profile.membershipInfo'),
    settings: t('profile.settings'),
    language: t('profile.language'),
    notifications: t('profile.notifications'),
    privacy: t('profile.privacy'),
    help: t('profile.help'),
    about: t('profile.about'),
    version: t('profile.version'),
  };

  const mileage = {
    request: {
      title: t('mileage.request.title'),
      subtitle: t('mileage.request.subtitle'),
      form: {
        ticketNumber: t('mileage.request.form.ticketNumber'),
        ticketNumberPlaceholder: t('mileage.request.form.ticketNumberPlaceholder'),
        flightDate: t('mileage.request.form.flightDate'),
        flightDatePlaceholder: t('mileage.request.form.flightDatePlaceholder'),
        origin: t('mileage.request.form.origin'),
        originPlaceholder: t('mileage.request.form.originPlaceholder'),
        destination: t('mileage.request.form.destination'),
        destinationPlaceholder: t('mileage.request.form.destinationPlaceholder'),
        airline: t('mileage.request.form.airline'),
        airlinePlaceholder: t('mileage.request.form.airlinePlaceholder'),
        fareClass: t('mileage.request.form.fareClass'),
        fareClassPlaceholder: t('mileage.request.form.fareClassPlaceholder'),
        submitRequest: t('mileage.request.form.submitRequest'),
        requestSubmitted: t('mileage.request.form.requestSubmitted'),
        requestFailed: t('mileage.request.form.requestFailed'),
      },
    },
    history: {
      title: t('mileage.history.title'),
      subtitle: t('mileage.history.subtitle'),
      noTransactions: t('mileage.history.noTransactions'),
      filterByDate: t('mileage.history.filterByDate'),
      filterByType: t('mileage.history.filterByType'),
      all: t('mileage.history.all'),
      earned: t('mileage.history.earned'),
      redeemed: t('mileage.history.redeemed'),
      expired: t('mileage.history.expired'),
    },
    tracking: {
      title: t('mileage.tracking.title'),
      subtitle: t('mileage.tracking.subtitle'),
      status: {
        pending: t('mileage.tracking.status.pending'),
        approved: t('mileage.tracking.status.approved'),
        rejected: t('mileage.tracking.status.rejected'),
        processing: t('mileage.tracking.status.processing'),
      },
      noRequests: t('mileage.tracking.noRequests'),
      requestId: t('mileage.tracking.requestId'),
      submittedDate: t('mileage.tracking.submittedDate'),
      lastUpdated: t('mileage.tracking.lastUpdated'),
    },
  };

  const errors = {
    networkError: t('errors.networkError'),
    serverError: t('errors.serverError'),
    validationError: t('errors.validationError'),
    notFound: t('errors.notFound'),
    unauthorized: t('errors.unauthorized'),
    somethingWentWrong: t('errors.somethingWentWrong'),
    validation: {
      ticketIdRequired: t('errors.validation.ticketIdRequired'),
      pnrRequired: t('errors.validation.pnrRequired'),
      carrierRequired: t('errors.validation.carrierRequired'),
      bookingClassRequired: t('errors.validation.bookingClassRequired'),
      fromCodeRequired: t('errors.validation.fromCodeRequired'),
      toCodeRequired: t('errors.validation.toCodeRequired'),
      fromToCodeDifferent: t('errors.validation.fromToCodeDifferent'),
      invalidUrl: t('errors.validation.invalidUrl'),
      invalidDate: t('errors.validation.invalidDate'),
    },
  };

  const languages = {
    en: t('languages.en'),
    vi: t('languages.vi'),
  };

  const landing = {
    title: t('landing.title'),
    subtitle: t('landing.subtitle'),
    getStarted: t('landing.getStarted'),
    joinNow: t('landing.joinNow'),
    benefits: {
      accumulateMiles: {
        title: t('landing.benefits.accumulateMiles.title'),
        description: t('landing.benefits.accumulateMiles.description'),
      },
      redeemRewards: {
        title: t('landing.benefits.redeemRewards.title'),
        description: t('landing.benefits.redeemRewards.description'),
      },
      security: {
        title: t('landing.benefits.security.title'),
        description: t('landing.benefits.security.description'),
      },
    },
  };

  const mileageRequest = {
    title: t('mileageRequest.title'),
    subtitle: t('mileageRequest.subtitle'),
    flightInformation: t('mileageRequest.flightInformation'),
    submitSuccess: t('mileageRequest.submitSuccess'),
    submitError: t('mileageRequest.submitError'),
    uploadFailed: t('mileageRequest.uploadFailed'),
  };

  const tracking = {
    title: t('tracking.title'),
    subtitle: t('tracking.subtitle'),
    searchPlaceholder: t('tracking.searchPlaceholder'),
    loadingRequests: t('tracking.loadingRequests'),
    noRequests: t('tracking.noRequests'),
    totalRequests: t('tracking.totalRequests'),
    viewDetails: t('tracking.viewDetails'),
    status: {
      pending: t('tracking.status.pending'),
      approved: t('tracking.status.approved'),
      rejected: t('tracking.status.rejected'),
      processing: t('tracking.status.processing'),
    },
  };

  const ledgers = {
    title: t('ledgers.title'),
    subtitle: t('ledgers.subtitle'),
    searchPlaceholder: t('ledgers.searchPlaceholder'),
    filterByDate: t('ledgers.filterByDate'),
    dateRanges: {
      all: t('ledgers.dateRanges.all'),
      today: t('ledgers.dateRanges.today'),
      thisWeek: t('ledgers.dateRanges.thisWeek'),
      thisMonth: t('ledgers.dateRanges.thisMonth'),
      lastMonth: t('ledgers.dateRanges.lastMonth'),
    },
    clearFilters: t('ledgers.clearFilters'),
    noTransactions: t('ledgers.noTransactions'),
    totalTransactions: t('ledgers.totalTransactions'),
    itemsPerPage: t('ledgers.itemsPerPage'),
    page: t('ledgers.page'),
    of: t('ledgers.of'),
    loading: t('ledgers.loading'),
    transactionTypes: {
      all: t('ledgers.transactionTypes.all'),
      earned: t('ledgers.transactionTypes.earned'),
      redeemed: t('ledgers.transactionTypes.redeemed'),
      expired: t('ledgers.transactionTypes.expired'),
    },
  };

  const notFound = {
    title: t('notFound.title'),
    subtitle: t('notFound.subtitle'),
    backHome: t('notFound.backHome'),
  };

  const authError = {
    title: t('authError.title'),
    subtitle: t('authError.subtitle'),
    tryAgain: t('authError.tryAgain'),
    contactSupport: t('authError.contactSupport'),
  };

  const contributor = {
    title: t('contributor.title'),
    subtitle: t('contributor.subtitle'),
    description: t('contributor.description'),
  };

  return {
    t,
    i18n,
    common,
    navigation,
    auth,
    home,
    profile,
    mileage,
    errors,
    languages,
    landing,
    mileageRequest,
    tracking,
    ledgers,
    notFound,
    authError,
    contributor,
  };
}
