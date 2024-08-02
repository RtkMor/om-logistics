use mongodb::bson::{self, doc, oid::ObjectId, Bson};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CartProduct {
    #[serde(rename = "_id")]
    pub id: Option<ObjectId>,
    pub user_id: ObjectId,
    pub products: Vec<CartItem>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CartItem {
    pub product_id: ObjectId,
    pub quantity: u32,
}

impl CartProduct {
    pub fn new(user_id: ObjectId, products: Vec<CartItem>) -> Self {
        Self {
            id: None,
            user_id,
            products,
        }
    }
}