use actix_web::{web, HttpResponse, Responder, post};
use mongodb::{
    bson::{doc, Document},
    Database,
};
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Serialize, Deserialize)]
pub struct CartItem {
    pub product_id: String,
    pub quantity: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AddToCartRequest {
    pub email: String,
    pub products: Vec<CartItem>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserCartInfo {
    pub email: String,
}

#[post("/carts")]
pub async fn add_to_cart(
    db: web::Data<Database>,
    cart_request: web::Json<AddToCartRequest>,
) -> impl Responder {
    let collection: mongodb::Collection<Document> = db.collection("carts");
    let cart_request = cart_request.into_inner();

    // Convert CartItem to BSON Document
    let products_bson: Vec<Document> = cart_request.products.iter().map(|item| {
        doc! {
            "product_id": &item.product_id,
            "quantity": item.quantity
        }
    }).collect();

    // Define the filter to find the user's cart by email
    let filter = doc! { "email": &cart_request.email };

    // Define the update operation
    let update = doc! { "$push": { "products": { "$each": products_bson.clone() } } };

    // Attempt to update an existing cart
    let update_result = collection.update_one(filter.clone(), update).await;

    match update_result {
        Ok(result) if result.matched_count > 0 => {
            // If the cart exists and was updated
            HttpResponse::Created().json(json!({ "success": true }))
        }
        Ok(_) => {
            // If the cart does not exist, create a new cart with the provided products
            let new_cart = doc! {
                "email": &cart_request.email,
                "products": &products_bson
            };
            match collection.insert_one(new_cart).await {
                Ok(_) => HttpResponse::Created().json(json!({ "success": true })),
                Err(_) => HttpResponse::InternalServerError().finish(),
            }
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("/fetch-cart")]
pub async fn fetch_cart_details(
    db: web::Data<Database>,
    user_cart: web::Json<UserCartInfo>,
) -> impl Responder {
    let collection: mongodb::Collection<Document> = db.collection("carts");
    let user_cart = user_cart.into_inner();

    // Define the filter to find the user's cart by email
    let filter = doc! { "email": &user_cart.email };

    // Attempt to find the cart
    match collection.find_one(filter).await {
        Ok(Some(cart)) => HttpResponse::Ok().json(json!({
            "success": true,
            "cart": cart
        })),
        Ok(None) => HttpResponse::NotFound().json(json!({
            "success": false,
            "message": "Cart not found"
        })),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}