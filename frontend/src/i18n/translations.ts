export type Lang = "uz" | "ru" | "en" | "zh" | "de" | "fr";

// BCP-47 tags for Intl/toLocaleString APIs. Record<Lang, string> means
// adding a 7th Lang without adding it here is a compile error, not a
// silent runtime fallback to Uzbek for that language's users.
export const LOCALE_TAGS: Record<Lang, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en-US",
  zh: "zh-CN",
  de: "de-DE",
  fr: "fr-FR",
};

export interface TranslationSchema {
  nav: {
    home: string;
    locations: string;
    ai: string;
    services: string;
    profile: string;
    about: string;
    saved: string;
    /** One-line descriptor under "Verso AI" in the sidebar. */
    ai_subtitle: string;
    /** Accessible name for the primary navigation landmark (sidebar
        on desktop, tab bar on mobile). Screen readers list landmarks
        by name; two unnamed <nav>s are announced as "navigation" twice. */
    primary: string;
    /** Skip-navigation link, visible only while focused. */
    skip_to_content: string;
    err_title: string;
    err_body: string;
    err_retry: string;
    offline_title: string;
    offline_body: string;
    /** The world index — the app's root destination now that the product
        covers every country rather than one. */
    atlas: string;
    /** The subscription tier. Left untranslated in most locales: it is the
        plan's name, not a description of it. */
    pro: string;
    /** Section heading for the command palette's non-navigation commands.
        This was a hardcoded Uzbek string, so five of the six locales showed
        raw Uzbek inside an otherwise translated dialog. */
    actions: string;
    /** Reviews + travel tips, gathered across every place and country. */
    community: string;
    /**
     * The tab-bar label, which can be shorter than the page's own title.
     * Five tabs share a 320px bar, and "Сообщество" / "Hamjamiyat" clipped
     * there even at 10px sentence case.
     */
    tab_community: string;
  };
  community: {
    title: string;
    subtitle: string;
    tab_reviews: string;
    tab_tips: string;
    reviews_desc: string;
    tips_desc: string;
    filter_all_countries: string;
    filter_category: string;
    filter_all_categories: string;
    tip_safety: string;
    tip_money: string;
    tip_customs: string;
    tip_transport: string;
    tip_food: string;
    no_reviews: string;
    no_tips: string;
    write_review_cta: string;
    tab_mine: string;
    mine_login_title: string;
    mine_login_desc: string;
    mine_empty_title: string;
    mine_empty_desc: string;
    composer_title: string;
    composer_location_placeholder: string;
    composer_placeholder: string;
    composer_submit: string;
    composer_posting: string;
    post_success: string;
    post_error: string;
    delete_error: string;
    remove_review: string;
  };
  home: {
    badge: string;
    hero_title: string;
    hero_subtitle: string;
    explore_btn: string;
    ai_btn: string;
    stats_places: string;
    stats_rating: string;
    stats_travelers: string;
    stats_langs: string;
    coming_soon: string;
    featured_title: string;
    all_title: string;
    ai_banner_title: string;
    ai_banner_desc: string;
    ai_banner_btn: string;
    cat_all: string;
    cat_tarix: string;
    cat_tabiat: string;
    cat_madaniyat: string;
    cat_din: string;
    cat_arxeologiya: string;
    see_all: string;
    uzb_banner_title: string;
    uzb_banner_desc: string;
  };
  locations: {
    title: string;
    subtitle: string;
    search_placeholder: string;
    no_results: string;
    no_results_hint: string;
    filter_all: string;
    found: string;
    city_filter: string;
    all_cities: string;
    country_filter: string;
    global_note: string;
    view_country_guide: string;
    sort_label: string;
    /** Default sort — a blend of rating and review count, so one 5.0 from a
        single review doesn't outrank a 4.7 with hundreds behind it. */
    sort_recommended: string;
    sort_rating: string;
    sort_price_asc: string;
    sort_price_desc: string;
    sort_reviews: string;
    clear_filters: string;
    clear: string;
    search_everything: string;
    search_recent: string;
    search_clear_recent: string;
    search_nav: string;
    search_open: string;
    search_close: string;
    search_empty_hint: string;
  };
  card: {
    add_plan: string;
    in_plan: string;
    added_toast: string;
    removed_toast: string;
  };
  detail: {
    hours: string;
    transport: string;
    best_season: string;
    reviews: string;
    no_reviews: string;
    load_more_reviews: string;
    reviews_load_error: string;
    write_review: string;
    add_plan: string;
    remove_plan: string;
    link_copied: string;
    map: string;
    ai_insight: string;
    free: string;
    review_placeholder: string;
    submit_review: string;
    description: string;
    practical_info: string;
    tags_section: string;
    how_to_get: string;
    price_label: string;
    duration_label: string;
    season_label: string;
    verified: string;
    not_found_title: string;
    not_found_desc: string;
    back_to_list: string;
    back: string;
    your_rating: string;
    insight_title: string;
    review_success: string;
    review_submit_error: string;
    add_first_review: string;
    insight_error: string;
    smart_review_label: string;
    total_reviews: string;
  };
  chat: {
    title: string;
    subtitle: string;
    reset: string;
    welcome: string;
    quick_samarqand: string;
    quick_hotel: string;
    quick_transport: string;
    quick_top: string;
    quick_tips: string;
    plan_banner_title: string;
    plan_banner_desc: string;
    plan_banner_more: string;
    plan_btn: string;
    plan_generating: string;
    plan_view: string;
    input_placeholder: string;
    hint: string;
    places: string;
    error: string;
    waking_up: string;
    retry: string;
    /** Control that opens a reply clamped on a phone. */
    read_more: string;
    read_less: string;
    send_label: string;
    cancel_label: string;
    disclaimer: string;
    empty_heading: string;
    reaction_thanks: string;
    quick_samarqand_prompt: string;
    quick_hotel_prompt: string;
    quick_transport_prompt: string;
    quick_top_prompt: string;
    quick_tips_prompt: string;
    plan_tour_intro: string;
    plan_tour_outro: string;
    /** Prefilled composer text when arriving from a country hub's "Start
        planning" button (…/chat?country=italy). Concatenated with the
        country's own name, the same way plan_tour_intro is concatenated
        with the saved-place list. */
    country_prompt: string;
    followups_label: string;
    followup_cheaper: string;
    followup_more_days: string;
    followup_stay: string;
    followup_season: string;
    followup_getting_around: string;
    in_atlas: string;
    start_with: string;
    model_label: string;
    model_fast: string;
    model_deep: string;
    model_fast_hint: string;
    model_deep_hint: string;
    /** Toast shown when a non-premium reader taps the locked Pro model. */
    model_pro_locked: string;
    /** Header button and panel title for past conversations. */
    history: string;
    history_empty: string;
    /** Fallback row label for an archived thread with no user turn to
        title itself from — should not normally occur, since archiveThread
        skips welcome-only threads, but a title is still required. */
    history_untitled: string;
    history_delete: string;
    history_clear_all: string;
    /**
     * A relative-time formatter for archived threads was tried first, via
     * Intl.RelativeTimeFormat — measured against this browser's own Chromium
     * build, uz-UZ resolves but renders as the bare fallback "-1 min"
     * instead of a real Uzbek phrase, and Intl.DateTimeFormat's month names
     * for uz-UZ have the same gap ("M09 20" instead of a month name). Both
     * of the browser's own locale-data APIs are unreliable for exactly the
     * language this product is built in, so the four keys below are hand
     * written instead of asking the browser to supply them.
     */
    time_just_now: string;
    /** Takes {n}. */
    time_minutes_ago: string;
    /** Takes {n}. */
    time_hours_ago: string;
    /** Takes {n}. */
    time_days_ago: string;
    tour_builder_title: string;
    tour_builder_subtitle: string;
    tour_builder_days_label: string;
    tour_builder_days_unit: string;
    tour_builder_people_label: string;
    tour_builder_people_solo: string;
    tour_builder_people_couple: string;
    tour_builder_people_family: string;
    tour_builder_people_group: string;
    tour_builder_budget_label: string;
    tour_builder_budget_low: string;
    tour_builder_budget_mid: string;
    tour_builder_budget_comfort: string;
    tour_builder_budget_luxury: string;
    tour_builder_regions_label: string;
    tour_builder_regions_hint: string;
    tour_builder_submit: string;
    tour_builder_summary: string;
  };
  services: {
    title: string;
    subtitle: string;
    tab_restaurants: string;
    tab_hotels: string;
    tab_guides: string;
    tab_transport: string;
    tab_currency: string;
    restaurants_title: string;
    restaurants_desc: string;
    hotels_title: string;
    hotels_desc: string;
    guides_title: string;
    guides_desc: string;
    transport_title: string;
    transport_desc: string;
    currency_title: string;
    currency_desc: string;
    search_placeholder: string;
    not_found_restaurant: string;
    not_found_hotel: string;
    not_found_guide: string;
    available: string;
    busy: string;
    per_night: string;
    per_day: string;
    currency_calc_title: string;
    currency_calc_desc: string;
    currency_table_title: string;
    currency_table_unit: string;
    train_type: string;
    train_desc: string;
    bus_type: string;
    bus_desc: string;
    taxi_type: string;
    taxi_desc: string;
    emergency: string;
    emergency_ambulance: string;
    emergency_fire: string;
    emergency_police: string;
    emergency_gas: string;
    emergency_tourism: string;
    uzbekistan: string;
    other_countries: string;
    hours_unit: string;
    min_unit: string;
    uzs_unit: string;
    menu_title: string;
    no_menu: string;
    address_label: string;
    hours_label: string;
    amenities_label: string;
    languages_label: string;
    open_map: string;
    close_label: string;
    view_details: string;
    booking_title: string;
    check_in: string;
    check_out: string;
    guests_label: string;
    contact_name_label: string;
    contact_phone_label: string;
    nights_label: string;
    total_label: string;
    submit_booking: string;
    booking_success_title: string;
    booking_success_desc: string;
    booking_error: string;
    book_another: string;
  };
  profile: {
    title: string;
    subtitle: string;
    guest_title: string;
    guest_desc: string;
    login_btn: string;
    register_btn: string;
    benefits_title: string;
    benefit1_title: string;
    benefit1_desc: string;
    benefit2_title: string;
    benefit2_desc: string;
    benefit3_title: string;
    benefit3_desc: string;
    benefit4_title: string;
    benefit4_desc: string;
    guest_plan_save_hint: string;
    theme_dark: string;
    theme_light: string;
    plan_title: string;
    plan_empty_title: string;
    plan_empty_desc: string;
    plan_empty_btn: string;
    plan_add: string;
    plan_ai_btn: string;
    lang_title: string;
    settings_title: string;
    logout: string;
    guest: string;
    sidebar_login_hint: string;
    plan_count_suffix: string;
    emergency_label: string;
    stat_trips: string;
    stat_saved: string;
    stat_reviews: string;
    reviews_empty: string;
    tab_saved: string;
    tab_itineraries: string;
    tab_reviews: string;
    tab_settings: string;
    itineraries_empty_title: string;
    itineraries_empty_desc: string;
    linked_accounts_title: string;
    linked_not_connected: string;
    linked_connected: string;
    edit_profile: string;
    edit_save: string;
    edit_cancel: string;
    edit_saved_toast: string;
    edit_error: string;
    avatar_change: string;
    avatar_remove: string;
    avatar_invalid_file: string;
    avatar_process_error: string;
    delete_account: string;
    delete_account_soon: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    country: string;
    email_placeholder: string;
    password_placeholder: string;
    name_placeholder: string;
    surname_placeholder: string;
    country_placeholder: string;
    country_search: string;
    country_clear: string;
    new_password_placeholder: string;
    login_btn: string;
    loading_login: string;
    register_btn: string;
    loading_register: string;
    back: string;
    continue: string;
    start: string;
    step_lang: string;
    step_info: string;
    step_done: string;
    lang_question: string;
    success_title: string;
    success_desc: string;
    success_feature1: string;
    success_feature2: string;
    success_feature3: string;
    err_name_short: string;
    err_surname_short: string;
    err_email_required: string;
    err_email_invalid: string;
    err_password_short: string;
    err_password_weak: string;
    pw_weak: string;
    pw_medium: string;
    pw_strong: string;
    required: string;
    form_errors_summary: string;
    err_login: string;
    step_verify: string;
    verify_title: string;
    verify_desc: string;
    verify_btn: string;
    verify_loading: string;
    resend_btn: string;
    resend_sent: string;
    /** Shown when a resend is refused because a code is still in flight. */
    code_already_sent: string;
    /** Shown when registration timed out but probably succeeded server-side. */
    register_maybe_sent: string;
    resend_wait: string;
    change_email_btn: string;
    err_verify: string;
    forgot_link: string;
    forgot_title: string;
    forgot_desc: string;
    forgot_send: string;
    reset_title: string;
    reset_desc: string;
    new_password: string;
    new_password_ph: string;
    reset_btn: string;
    reset_loading: string;
    reset_done: string;
    back_to_login: string;
    err_reset: string;
    shot_registan: string;
    shot_ichanqala: string;
    shot_chimgan: string;
    shot_chorsu: string;
    back_home: string;
    err_register: string;
    err_waking_up: string;
    err_password_required: string;
  };
  saved: {
    title: string;
    subtitle: string;
    empty_title: string;
    empty_desc: string;
    empty_title_guest: string;
    empty_desc_guest: string;
    explore_btn: string;
    ai_btn: string;
    cities_suffix: string;
    ai_banner: string;
    toggle: string;
    filter_all: string;
    filter_places: string;
    filter_restaurants: string;
    filter_hotels: string;
    items_suffix: string;
  };
  landing: {
    hero_title: string;
    hero_subtitle: string;
    cta_signup: string;
    cta_guest: string;
    sign_in: string;
    open_app: string;
    features_title: string;
    feature1_title: string;
    feature1_desc: string;
    feature2_title: string;
    feature2_desc: string;
    feature3_title: string;
    feature3_desc: string;
    feature4_title: string;
    feature4_desc: string;
    destinations_title: string;
    destinations_subtitle: string;
    see_all: string;
    final_cta_title: string;
    final_cta_desc: string;
    membership_kicker: string;
    footer_tagline: string;
    proof_title: string;
    proof_reviews: string;
    proof_rating: string;
    proof_places: string;
    scroll_cue: string;
    language_label: string;
    countries_word: string;
    continents_word: string;
    footer_explore: string;
    footer_legal: string;
    footer_privacy: string;
    footer_terms: string;
    footer_contact: string;
    footer_top: string;
    footer_built: string;
    last_updated: string;
  };
  atlas: {
    kicker: string;
    hero_title: string;
    hero_subtitle: string;
    leading_with: string;
    leading_title: string;
    search_label: string;
    search_placeholder: string;
    filter_all: string;
    no_results: string;
    // Continent names come from the country dataset as English keys, so the
    // display label has to be looked up per locale rather than rendered raw.
    continent_europe: string;
    continent_asia: string;
    continent_africa: string;
    continent_north_america: string;
    continent_south_america: string;
    continent_oceania: string;
    no_results_hint: string;
    sort_label: string;
    sort_name: string;
    sort_price_asc: string;
    sort_price_desc: string;
    budget_label: string;
    budget_any: string;
    showing: string;
    clear: string;
  };
  // The country hub. Sentences carrying {country} / {currency} keep the
  // placeholder inside the string so each translator can put it where that
  // language actually wants it.
  country: {
    when_to_go: string;
    entry: string;
    entry_disclaimer: string;
    ai_title: string;
    ai_body: string;
    ai_cta: string;
    essentials: string;
    capital: string;
    currency: string;
    cost: string;
    dialling: string;
    languages: string;
    emergency: string;
    emergency_note: string;
    police: string;
    ambulance: string;
    fire: string;
    tourist_police: string;
    members_only: string;
    pro_title: string;
    pro_body: string;
    pro_cta: string;
    places: string;
    places_title: string;
    browse_all: string;
    country_level_note: string;
    ask_ai: string;
    /** Shown above the global-places grid: this prose is Uzbek-only, unlike
     *  the rest of the hub, which is fully localised. */
    places_uz_note: string;
    local_time: string;
    hours_short: string;
    same_time: string;
    compare: string;
    compare_title: string;
    compare_cta: string;
    compare_clear: string;
    compare_hint: string;
    compare_add: string;
    compare_remove: string;
    compare_selected: string;
    map: string;
    map_caption: string;
  };
  pro: {
    membership: string; hero_body: string;
    p1_k: string; p1_t: string; p1_b: string;
    p2_k: string; p2_t: string; p2_b: string;
    p3_k: string; p3_t: string; p3_b: string;
    p4_k: string; p4_t: string; p4_b: string;
    cycle_annual: string; cycle_monthly: string; per_month: string; per_year: string;
    note_monthly: string; note_annual: string;
    cta_member: string; cta_signin: string; billing_note: string; checkout_toast: string;
    cmp_included: string; cmp_free: string; cmp_pro: string; cmp_no: string; cmp_yes: string;
    r_countries: string; r_ai_questions: string; r_ai_model: string; r_itinerary: string;
    r_export: string; r_offline: string; r_unlisted: string; r_routes: string;
    r_concierge: string; r_support: string;
    v_all: string; v_five_day: string; v_unlimited: string; v_standard: string;
    v_long_context: string; v_three_days: string;
    outro_kicker: string; outro_body: string; back: string;
  };
  voice: {
    title: string;
    subtitle: string;
    from_label: string;
    to_label: string;
    swap: string;
    tap_to_speak: string;
    listening: string;
    translating: string;
    replay: string;
    unsupported: string;
    mic_denied: string;
    error: string;
    speak_again: string;
    /** Takes {lang} — the label of the language being spoken. */
    speak_in: string;
    no_voice: string;
    lang_unsupported: string;
    no_speech: string;
    network_error: string;
    mic_busy: string;
    type_instead: string;
    placeholder: string;
    retranslate: string;
    copy: string;
    copied: string;
    play: string;
    stop: string;
    history: string;
    clear: string;
    /** Header label for the row of ready-made travel phrases. */
    phrasebook: string;
    phrase_hello: string;
    phrase_thanks: string;
    phrase_price: string;
    phrase_bathroom: string;
    phrase_help: string;
    phrase_taxi: string;
    phrase_no_understand: string;
    phrase_english: string;
    /** Toggle: read the translation back at reduced speed. */
    slow: string;
  };
  tour: {
    next: string;
    back: string;
    done: string;
    skip: string;
    restart: string;
    ai_title: string;
    ai_body: string;
    loc_title: string;
    loc_body: string;
    saved_title: string;
    saved_body: string;
    profile_title: string;
    profile_body: string;
  };
}

// ─── Uzbek (base) ────────────────────────────────────────────────────────────
