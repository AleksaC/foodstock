function buildNutriValues(nutritionalValues) {
    // Form the nutritional values
    let nutriValues = {
        energy: nutritionalValues.energy || "",
        fats: nutritionalValues.fats || 0,
        saturatedFats: nutritionalValues.saturatedFats || 0,
        proteins: nutritionalValues.proteins || 0,
        carbs: nutritionalValues.carbs || 0,
        sugar: nutritionalValues.sugar || 0,
        fibers: nutritionalValues.fibers || 0,
        salt: nutritionalValues.salt || 0,
    };
    return nutriValues;
}

function buildPrice(currentPrice) {
    // Form the price information
    let price = {
        date: currentPrice.date,
        discountAmount: currentPrice.discountAmount,
        discountStartDate: currentPrice.discountStartDate,
        discountEndDate: currentPrice.discountEndDate,
        discountPrice: currentPrice.discountPrice,
        regularPrice: currentPrice.regularPrice,
    };
    return price;
}

function buildDescription(itemDescription) {
    // Form the description attribute
    let description = {
        allergens: itemDescription.allergens,
        alcohol: itemDescription.alcohol,
        additionalInformation: itemDescription.additionalInformation,
        producer: itemDescription.producer,
        expiryDate: itemDescription.expiryDate,
        ingredients: itemDescription.ingredients,
        imports: itemDescription.imports,
        countryOfOrigin: itemDescription.countryOfOrigin,
        maintenance: itemDescription.maintenance,
    };
    return description;
}

export default {
    buildDescription,
    buildNutriValues,
    buildPrice
};