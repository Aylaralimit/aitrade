import { db } from './index';

// Kullanıcı sorguları
export const userQueries = {
  createUser: db.prepare(`
    INSERT INTO users (id, email, name, account_type, balance, verification_status)
    VALUES (@id, @email, @name, @account_type, @balance, @verification_status)
  `),

  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  
  getUser: db.prepare('SELECT * FROM users WHERE id = ?'),
  
  getAllUsers: db.prepare('SELECT * FROM users WHERE is_admin = 0'),
  
  updateUser: db.prepare(`
    UPDATE users
    SET balance = @balance, verification_status = @verification_status
    WHERE id = @id
  `),

  updateLastLogin: db.prepare(`
    UPDATE users
    SET last_login = @last_login
    WHERE id = @id
  `),

  addLoginHistory: db.prepare(`
    INSERT INTO login_history (user_id, ip_address, device, browser)
    VALUES (@user_id, @ip_address, @device, @browser)
  `),

  getUserLoginHistory: db.prepare(`
    SELECT * FROM login_history 
    WHERE user_id = ? 
    ORDER BY login_time DESC
  `),

  addVerificationDocument: db.prepare(`
    INSERT INTO verification_documents 
    (user_id, document_type, file_url, status)
    VALUES (@user_id, @document_type, @file_url, @status)
  `),

  addSupportMessage: db.prepare(`
    INSERT INTO support_messages 
    (user_id, name, email, phone, message, status)
    VALUES (@user_id, @name, @email, @phone, @message, @status)
  `)
};

// İşlem sorguları
export const tradeQueries = {
  createTrade: db.prepare(`
    INSERT INTO trades 
    (user_id, symbol, type, amount, entry_price, stop_loss, take_profit)
    VALUES (@user_id, @symbol, @type, @amount, @entry_price, @stop_loss, @take_profit)
  `),

  closeTrade: db.prepare(`
    UPDATE trades
    SET status = 'closed', 
        exit_price = @exit_price,
        closed_at = CURRENT_TIMESTAMP,
        profit_loss = (@exit_price - entry_price) * amount * 
          CASE type WHEN 'long' THEN 1 ELSE -1 END
    WHERE id = @id
  `),

  getUserOpenTrades: db.prepare(`
    SELECT * FROM trades 
    WHERE user_id = ? AND status = 'open'
    ORDER BY created_at DESC
  `),

  getUserTradeHistory: db.prepare(`
    SELECT * FROM trades 
    WHERE user_id = ?
    ORDER BY created_at DESC
  `)
};

// Bot istatistikleri sorguları
export const botQueries = {
  updateBotStats: db.prepare(`
    INSERT OR REPLACE INTO bot_stats 
    (user_id, total_trades, winning_trades, losing_trades, profit_loss, success_rate)
    VALUES (@user_id, @total_trades, @winning_trades, @losing_trades, @profit_loss, @success_rate)
  `),

  getUserBotStats: db.prepare('SELECT * FROM bot_stats WHERE user_id = ?')
};