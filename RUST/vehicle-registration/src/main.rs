use lambda_runtime::{service_fn, Error, LambdaEvent};
use serde_json::{json, Value};

extern crate serde_derive;

#[tokio::main]
async fn main() -> std::result::Result<(), Error> {
    let func = service_fn(vehicle_registration);
    lambda_runtime::run(func).await?;
    Ok(())
}

async fn vehicle_registration(
    e: LambdaEvent<Value>,
) -> std::result::Result<Value, Error> {
    let request_payload = e.payload;
    // [+] check for keys vin, options, ph_no and it's type
    // [+] if present consider the value else return error
    // [+] return specific error message
    //     - eg: invalid phone number | invalid vin, no proper options etc

    if let Some(payload_obj) = request_payload.as_object() {
        if let Some(vin) = payload_obj.get("vin").and_then(Value::as_str) {
            println!("VIN: {}", vin);
        } else {
            println!("invalid VIN");
        }

        if let Some(options) = payload_obj.get("options").and_then(Value::as_array) {
            println!("Options: ");
            for option in options {
                if let Some(option_str) = option.as_str() {
                    println!("{}", option_str);
                } else {
                    println!("no option found");
                }
            }
        } else {
            println!("Options not found or not an array");
        }

        if let Some(phone_no) = payload_obj.get("phone_no").and_then(Value::as_u64) {
            println!("Phone Number: {}", phone_no);
        } else {
            println!("Invalid Phone Number");
        }
    } else {
        println!("Payload is not an object");
    }

    println!("{:?}", request_payload);

    Ok(json!({
        "success": true,
    }))
}
