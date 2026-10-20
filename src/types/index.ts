export type NavTab = 'articles' | 'conversations' | 'orders' | 'accounts' | 'settings';

export interface ArticleListing {
  id: string;
  title: string;
  price: number; // in dhs (MAD)
  image: string;
  status: 'Published' | 'Draft' | 'Archived';
  totalAccountListings: number;
  activeCount: number;
  archivedCount: number;
  deletedCount: number;
  views: number;
  variantsCount: number;
  updatedAt: string;
  conversationsCount: number;
  unreadConversationsCount: number;
  category?: string;
}

export interface ArticleVariant {
  id: string;
  articleId: string;
  account: string;
  city: string;
  titleVariant: string;
  status: 'Active' | 'Archived' | 'Pending';
  views: number;
  lastRepostedAt: string;
}

export type OrderStatus = 'In progress' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type OrderSubstatus = 'Needs city' | 'Needs phone number' | 'Needs buyer confirmation' | 'Needs quantity' | 'Needs location' | 'Ready to ship' | 'Complete';

export interface Order {
  id: string;
  orderNumber: string; // e.g. #896c5526
  buyerName: string;
  buyerAvatarInitial: string;
  facebookAccount: string;
  articleTitle: string;
  articlePrice: number;
  quantity: number;
  deliveryCity: string; // e.g. "Casablanca" or "Not provided"
  deliveryFee: number; // e.g. 20 or 35 dhs
  paymentMethod: string; // "Pay on delivery" (COD)
  totalAmount: number; // in dhs
  status: OrderStatus;
  substatus: OrderSubstatus;
  createdAt: string;
  buyerPhone?: string;
  buyerAddress?: string;
  sellerNotes?: string;
}

export interface ProxyConfig {
  ip: string;
  port: number;
  status: 'Working' | 'Checking' | 'Failed';
  checkedAt: string;
  expiresAt: string;
  lastExitNode: string;
  protocol: 'IPv6' | 'IPv4';
  latencyMs?: number;
}

export interface FacebookAccount {
  id: string;
  displayName: string;
  identifier: string; // phone or email e.g. "0606599967"
  avatarInitial: string;
  isLinked: boolean;
  status: 'Online' | 'Offline' | 'Attention';
  lastSync: string;
  proxy: ProxyConfig;
  chatbotEnabled: boolean;
  buyersStatus: string;
  marketplaceAvailable: boolean;
  marketplaceCheckedAt: string;
  marketplaceNextCheckAt: string;
  dailyWarmupEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'bot' | 'seller';
  text: string;
  timestamp: string;
  isAutoReply?: boolean;
}

export type BuyerSentiment = 'positive' | 'neutral' | 'hesitant' | 'negative';
export type InterventionType = 'auto' | 'manual' | 'escalated';

export interface Conversation {
  id: string;
  articleId: string;
  buyerName: string;
  buyerPhone?: string;
  buyerCity?: string;
  facebookAccount: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: ChatMessage[];
  botPaused: boolean;
  hasOrderCreated?: boolean;
  sentiment?: BuyerSentiment;
  sentimentScore?: number; // 0 to 100
  interventionType?: InterventionType;
  resolutionStatus?: 'converted' | 'dropped' | 'in_progress';
}

export interface CityFee {
  id: string;
  cityAliases: string; // e.g. "Casablanca, Casa, الدار البيضاء, الدارالبيضاء"
  fee: number; // MAD
}

export interface ChatbotSettings {
  autoRepliesEnabled: boolean;
  confirmOrders: boolean;
  cashOnDelivery: boolean;
  minReplyDelaySeconds: number;
  maxReplyDelaySeconds: number;
  replyLanguage: 'Darija' | 'Français' | 'العربية' | 'English';
  greetingAnswer: string;
  deliveryAnswer: string;
  otherCitiesFee: number;
  shopLocationAnswer: string;
  sellerContactAnswer: string;
  offerLastPriceDiscount: boolean;
  lastPriceDiscountPercent: number;
  discountRounding: 'Whole dhs (round up)' | 'Exact (2 decimals)';
  warrantyAnswer?: string;
  stockAnswer?: string;
  returnPolicyAnswer?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  role: 'Administrator' | 'Manager' | 'Agent';
  status: 'Active' | 'Inactive';
  lastSignIn: string;
  isCurrentUser?: boolean;
}

export interface ActivityLogItem {
  id: string;
  title: string;
  description: string;
  category: 'repost' | 'chatbot' | 'order' | 'account' | 'proxy';
  timestamp: string;
  status: 'success' | 'warning' | 'info';
}
