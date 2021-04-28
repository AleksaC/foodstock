function buildNutriValues(item) {
    // Form the nutritional values
    let nutriValues = {
        energy: item.energy || "",
        fats: item.fats || 0,
        saturatedFats: item.saturated_fats || 0,
        proteins: item.proteins || 0,
        carbs: item.carbs || 0,
        sugar: item.sugar || 0,
        fibers: item.fiber || 0,
        salt: item.salt || 0,
    };
    return nutriValues;
}

function buildPrice(item) {
    // Form the price information
    let today = new Date().toISOString().slice(0, 10); // https://stackoverflow.com/a/35922073
    let dscAmt, dscSD, dscED, dscPr, regPr; // they correspond, in order, to the names of keys in the price object
    if ("discount_info" in item) {
        dscAmt = item.discount_info.discount.slice(0, -1); // remove the %
        let dates = item.discount_info.duration.split("-");
        dscSD = dates[0]; // start date of discount
        dscED = dates[1]; // end date of discount
        dscPr = item.price_info.discounted_price.slice(0, -1); // remove the euro sign
        regPr = item.price_info.old_price.slice(0, -1);
    } else {
        dscAmt = dscSD = dscED = dscPr = "";
        regPr = item.price_info.current_price.slice(0, -1);
    }
    let price = {
        // store: "Voli",
        date: today,
        discountAmount: dscAmt,
        discountStartDate: dscSD,
        discountEndDate: dscED,
        discountPrice: dscPr,
        regularPrice: regPr,
    };
    return price;
}

function buildDescription(item) {
    // Form the description attribute
    let description;
    if (!item.description) {
        description = {
            maintenance: "",
            countryOfOrigin: "",
            producer: "",
            imports: "",
            ingredients: "",
            expiryDate: "",
            allergens: "",
            alcohol: "",
            additionalInformation: "",
        };
    } else {
        description = {
            maintenance: item.description["Čuvanje"],
            countryOfOrigin: item.description["Zemlja"],
            producer: item.description["Proizvođač"],
            imports: item.description["Uvozi"],
            ingredients: item.description["Sastojci"],
            expiryDate: item.description["Rok upotrebe"],
            allergens: item.description["Alergeni"],
            alcohol: item.description["Alkohol"],
            additionalInformation: item.description["Dodatne informacije"],
        };
    }
    return description;
}

export default {
    buildDescription,
    buildNutriValues,
    buildPrice
};