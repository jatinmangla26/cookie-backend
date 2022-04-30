export interface Item {
    name: String;
    reviews:[review]
    Cost: {
        Price:Number;
        negotiable:Boolean
    };
    expiresOn:Date;
    shippingAddress:String;
    
    Quantity: Number;
    user:any;
    Description: String;
    Category: String;
    imageUrl: string;
}
export interface review{
    user:any;
    name:String;
    comment:String;

}