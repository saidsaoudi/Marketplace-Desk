import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  ArticleListing,
  ArticleVariant,
  Order,
  Conversation,
  FacebookAccount,
  ChatbotSettings,
  CityFee,
} from '../types';

// ==========================================
// ARTICLES API
// ==========================================

export async function fetchArticlesFromDb(): Promise<ArticleListing[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetchArticles error:', error?.message);
      return null;
    }

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      price: Number(row.price),
      image: row.image,
      status: row.status,
      totalAccountListings: row.total_account_listings || 0,
      activeCount: row.active_count || 0,
      archivedCount: row.archived_count || 0,
      deletedCount: row.deleted_count || 0,
      views: row.views || 0,
      variantsCount: row.variants_count || 0,
      updatedAt: row.updated_at || 'Just now',
      conversationsCount: row.conversations_count || 0,
      unreadConversationsCount: row.unread_conversations_count || 0,
      category: row.category || 'Maison et cuisine',
      condition: row.condition || 'New',
      location: row.location || 'Casablanca',
      description: row.description || '',
      facebookUrl: row.facebook_url || '',
    }));
  } catch (err) {
    console.error('Failed to load articles from Supabase:', err);
    return null;
  }
}

export async function upsertArticleInDb(article: ArticleListing): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('articles').upsert({
      id: article.id,
      title: article.title,
      price: article.price,
      image: article.image,
      status: article.status,
      total_account_listings: article.totalAccountListings,
      active_count: article.activeCount,
      archived_count: article.archivedCount,
      deleted_count: article.deletedCount,
      views: article.views,
      variants_count: article.variantsCount,
      updated_at: article.updatedAt,
      conversations_count: article.conversationsCount,
      unread_conversations_count: article.unreadConversationsCount,
      category: article.category,
      condition: article.condition,
      location: article.location,
      description: article.description,
      facebook_url: article.facebookUrl,
    });

    if (error) {
      console.error('Supabase upsertArticle error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to upsert article:', err);
    return false;
  }
}

export async function deleteArticleFromDb(articleId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('articles').delete().eq('id', articleId);
    if (error) {
      console.error('Supabase deleteArticle error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete article:', err);
    return false;
  }
}

// ==========================================
// VARIANTS API
// ==========================================

export async function fetchVariantsFromDb(): Promise<ArticleVariant[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('article_variants').select('*');
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      articleId: row.article_id,
      account: row.account,
      city: row.city,
      titleVariant: row.title_variant,
      status: row.status,
      views: row.views || 0,
      lastRepostedAt: row.last_reposted_at || 'Just now',
    }));
  } catch (err) {
    console.error('Failed to load variants from Supabase:', err);
    return null;
  }
}

export async function upsertVariantInDb(variant: ArticleVariant): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('article_variants').upsert({
      id: variant.id,
      article_id: variant.articleId,
      account: variant.account,
      city: variant.city,
      title_variant: variant.titleVariant,
      status: variant.status,
      views: variant.views,
      last_reposted_at: variant.lastRepostedAt,
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// ==========================================
// ORDERS API
// ==========================================

export async function fetchOrdersFromDb(): Promise<Order[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('orders').select('*');
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      orderNumber: row.order_number,
      buyerName: row.buyer_name,
      buyerAvatarInitial: row.buyer_avatar_initial || 'B',
      facebookAccount: row.facebook_account,
      articleTitle: row.article_title,
      articlePrice: Number(row.article_price),
      quantity: row.quantity || 1,
      deliveryCity: row.delivery_city,
      deliveryFee: Number(row.delivery_fee) || 25,
      paymentMethod: row.payment_method || 'Pay on delivery',
      totalAmount: Number(row.total_amount),
      status: row.status,
      substatus: row.substatus,
      createdAt: row.created_at,
      buyerPhone: row.buyer_phone,
      buyerAddress: row.buyer_address,
      sellerNotes: row.seller_notes,
    }));
  } catch (err) {
    return null;
  }
}

export async function upsertOrderInDb(order: Order): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('orders').upsert({
      id: order.id,
      order_number: order.orderNumber,
      buyer_name: order.buyerName,
      buyer_avatar_initial: order.buyerAvatarInitial,
      facebook_account: order.facebookAccount,
      article_title: order.articleTitle,
      article_price: order.articlePrice,
      quantity: order.quantity,
      delivery_city: order.deliveryCity,
      delivery_fee: order.deliveryFee,
      payment_method: order.paymentMethod,
      total_amount: order.totalAmount,
      status: order.status,
      substatus: order.substatus,
      created_at: order.createdAt,
      buyer_phone: order.buyerPhone,
      buyer_address: order.buyerAddress,
      seller_notes: order.sellerNotes,
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// ==========================================
// CONVERSATIONS API
// ==========================================

export async function fetchConversationsFromDb(): Promise<Conversation[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('conversations').select('*');
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      articleId: row.article_id,
      buyerName: row.buyer_name,
      buyerPhone: row.buyer_phone,
      buyerCity: row.buyer_city,
      facebookAccount: row.facebook_account,
      lastMessage: row.last_message,
      lastMessageTime: row.last_message_time,
      unread: row.unread ?? false,
      messages: row.messages || [],
      botPaused: row.bot_paused ?? false,
      hasOrderCreated: row.has_order_created ?? false,
      sentiment: row.sentiment || 'neutral',
      sentimentScore: row.sentiment_score || 75,
      interventionType: row.intervention_type || 'auto',
      resolutionStatus: row.resolution_status || 'in_progress',
    }));
  } catch (err) {
    return null;
  }
}

export async function upsertConversationInDb(conv: Conversation): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('conversations').upsert({
      id: conv.id,
      article_id: conv.articleId,
      buyer_name: conv.buyerName,
      buyer_phone: conv.buyerPhone,
      buyer_city: conv.buyerCity,
      facebook_account: conv.facebookAccount,
      last_message: conv.lastMessage,
      last_message_time: conv.lastMessageTime,
      unread: conv.unread,
      messages: conv.messages,
      bot_paused: conv.botPaused,
      has_order_created: conv.hasOrderCreated,
      sentiment: conv.sentiment,
      sentiment_score: conv.sentimentScore,
      intervention_type: conv.interventionType,
      resolution_status: conv.resolutionStatus,
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// ==========================================
// FACEBOOK ACCOUNTS API
// ==========================================

export async function fetchAccountsFromDb(): Promise<FacebookAccount[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('facebook_accounts').select('*');
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      displayName: row.display_name,
      identifier: row.identifier,
      avatarInitial: row.avatar_initial || 'F',
      isLinked: row.is_linked ?? true,
      status: row.status || 'Online',
      lastSync: row.last_sync || 'Just now',
      proxy: row.proxy || {},
      chatbotEnabled: row.chatbot_enabled ?? true,
      buyersStatus: row.buyers_status || 'Ready',
      marketplaceAvailable: row.marketplace_available ?? true,
      marketplaceCheckedAt: row.marketplace_checked_at || 'Just now',
      marketplaceNextCheckAt: row.marketplace_next_check_at || 'In 1h',
      dailyWarmupEnabled: row.daily_warmup_enabled ?? true,
    }));
  } catch (err) {
    return null;
  }
}

export async function upsertAccountInDb(acc: FacebookAccount): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('facebook_accounts').upsert({
      id: acc.id,
      display_name: acc.displayName,
      identifier: acc.identifier,
      avatar_initial: acc.avatarInitial,
      is_linked: acc.isLinked,
      status: acc.status,
      last_sync: acc.lastSync,
      proxy: acc.proxy,
      chatbot_enabled: acc.chatbotEnabled,
      buyers_status: acc.buyersStatus,
      marketplace_available: acc.marketplaceAvailable,
      marketplace_checked_at: acc.marketplaceCheckedAt,
      marketplace_next_check_at: acc.marketplaceNextCheckAt,
      daily_warmup_enabled: acc.dailyWarmupEnabled,
    });
    return !error;
  } catch (err) {
    return false;
  }
}

// ==========================================
// CHATBOT SETTINGS & CITY FEES API
// ==========================================

export async function fetchChatbotSettingsFromDb(): Promise<ChatbotSettings | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('chatbot_settings').select('*').limit(1).single();
    if (error || !data) return null;

    return {
      autoRepliesEnabled: data.auto_replies_enabled ?? true,
      confirmOrders: data.confirm_orders ?? true,
      cashOnDelivery: data.cash_on_delivery ?? true,
      minReplyDelaySeconds: data.min_reply_delay_seconds || 2,
      maxReplyDelaySeconds: data.max_reply_delay_seconds || 6,
      replyLanguage: data.reply_language || 'Darija',
      greetingAnswer: data.greeting_answer || 'Merhba bik! Kifach n9dro n3awnok?',
      deliveryAnswer: data.delivery_answer || 'Livraison f ga3 lmaghrib.',
      otherCitiesFee: Number(data.other_cities_fee) || 35,
      shopLocationAnswer: data.shop_location_answer || 'Casablanca Maarif',
      sellerContactAnswer: data.seller_contact_answer || '06 60 65 75 70',
      offerLastPriceDiscount: data.offer_last_price_discount ?? true,
      lastPriceDiscountPercent: Number(data.last_price_discount_percent) || 10,
      discountRounding: data.discount_rounding || 'Whole dhs (round up)',
    };
  } catch (err) {
    return null;
  }
}

export async function saveChatbotSettingsInDb(settings: ChatbotSettings): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('chatbot_settings').upsert({
      id: 'default',
      auto_replies_enabled: settings.autoRepliesEnabled,
      confirm_orders: settings.confirmOrders,
      cash_on_delivery: settings.cashOnDelivery,
      min_reply_delay_seconds: settings.minReplyDelaySeconds,
      max_reply_delay_seconds: settings.maxReplyDelaySeconds,
      reply_language: settings.replyLanguage,
      greeting_answer: settings.greetingAnswer,
      delivery_answer: settings.deliveryAnswer,
      other_cities_fee: settings.otherCitiesFee,
      shop_location_answer: settings.shopLocationAnswer,
      seller_contact_answer: settings.sellerContactAnswer,
      offer_last_price_discount: settings.offerLastPriceDiscount,
      last_price_discount_percent: settings.lastPriceDiscountPercent,
      discount_rounding: settings.discountRounding,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch (err) {
    return false;
  }
}

export async function fetchCityFeesFromDb(): Promise<CityFee[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('city_fees').select('*');
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      cityAliases: row.city_aliases,
      fee: Number(row.fee),
    }));
  } catch (err) {
    return null;
  }
}

export async function saveCityFeesInDb(fees: CityFee[]): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const rows = fees.map((f) => ({
      id: f.id,
      city_aliases: f.cityAliases,
      fee: f.fee,
    }));
    const { error } = await supabase.from('city_fees').upsert(rows);
    return !error;
  } catch (err) {
    return false;
  }
}
