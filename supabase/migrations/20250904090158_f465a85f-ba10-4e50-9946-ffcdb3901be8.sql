-- Add performance indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_child_profiles_parent_id ON child_profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_tracing_progress_user_id ON tracing_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_tracing_progress_letter ON tracing_progress(letter);
CREATE INDEX IF NOT EXISTS idx_woocommerce_orders_user_id ON woocommerce_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_woocommerce_orders_status ON woocommerce_orders(status);
CREATE INDEX IF NOT EXISTS idx_woocommerce_orders_created_at ON woocommerce_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_printables_category ON printables(category);
CREATE INDEX IF NOT EXISTS idx_printables_status ON printables(status);
CREATE INDEX IF NOT EXISTS idx_printables_featured ON printables(featured);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_tracing_progress_user_letter ON tracing_progress(user_id, letter);
CREATE INDEX IF NOT EXISTS idx_woocommerce_orders_user_status ON woocommerce_orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_printables_category_status ON printables(category, status);