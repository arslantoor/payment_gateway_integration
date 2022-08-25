var payButton = document.querySelector('#paybutton');
var tokenizeButton = document.querySelector('#tokenizebutton');

// Init Stax JS SDK
var staxJs = new StaxJs('software-developer-6e4db5b06b6e', {});

// Pay with bank
document.querySelector('#paybutton').onclick = () => {
    successElement.classList.remove("visible");
    errorElement.classList.remove("visible");
    loaderElement.classList.add("visible");

    staxJs
        .pay(paymentExtraDetails)
        .then((completedTransaction) => {
            // completedTransaction is the successful transaction record
            console.log('successful payment:', completedTransaction);
            if (completedTransaction.id) {
                successElement.querySelector(".token").textContent =
                    completedTransaction.payment_method_id;
                successElement.classList.add("visible");
                loaderElement.classList.remove("visible");
            }
        })
        .catch(err => {
            // handle errors here
            console.log('unsuccessful payment:', err);
            errorElement.textContent = 'unsuccessful payment';
            errorElement.classList.add("visible");
            loaderElement.classList.remove("visible");
        });
}

// Tokenize bank
document.querySelector('#tokenizebutton').onclick = () => {

    successElement.classList.remove("visible");
    errorElement.classList.remove("visible");
    loaderElement.classList.add("visible");

    staxJs .tokenize(tokenizationExtraDetails)   .then((tokenizedPaymentMethod) => {
        // tokenizedPaymentMethod is the tokenized payment record
        console.log('successful tokenization:', tokenizedPaymentMethod);
        if (tokenizedPaymentMethod) {
            successElement.querySelector(".token").textContent = tokenizedPaymentMethod.id;
            successElement.classList.add("visible");
        }
        loaderElement.classList.remove("visible");
    })
        .catch(err => {
            // handle errors here
            console.log('unsuccessful tokenization:', err);
        });
}


// Setting variables to use in extraDetails
var form = document.forms[0];

// UI elements
var successElement = document.querySelector(".success");
var errorElement = document.querySelector(".error");
var loaderElement = document.querySelector(".loader");

// Form values
var firstName = form.querySelector("input[name=first-name]").value;
var lastName = form.querySelector("input[name=last-name]").value;
var accountNumber = form.querySelector("input[name=account-number]").value;
var routingNumber = form.querySelector("input[name=routing-number]").value;



/**
 * Below are the
 * extraDetails objects used
 * when paying a bank or
 * tokenizing * a bank.
 */

var tokenizationExtraDetails = {
    /* Start Bank Details */
    method: "bank", // very important to set this as "bank" for ACH payments
    bank_name: "Chase", // bank name, e.g. "Chase"
    bank_account: accountNumber, // bank account number
    bank_routing: routingNumber, // bank routing number
    bank_type: "checking", // "checking" or "savings"
    bank_holder_type: "personal", // "personal" or "business"
    /* End Bank Details */
    firstname: firstName, // customer first name
    lastname: lastName, // customer last name
    person_name: firstName + ' ' + lastName,
    phone: "5555555555", // customer phone number
    address_1: "100 S Orange Ave", // customer address line 1
    address_2: "Suite 400", // customer address line 2
    address_city: "Orlando", // customer address city
    address_state: "FL", // customer address state
    address_zip: "32811", // customer address zip
    address_country: "USA", // customer address country
    url: "https://app.staxpayments.com/#/bill/", // url -- just keep this as is unless you're testing
    // validate is optional and can be true or false.
    // determines whether or not stax.js does client-side validation.
    // the validation follows the sames rules as the api.
    // check the Validation section for more details.
    validate: false,
};

var paymentExtraDetails = {
    firstname: firstName,
    lastname: lastName,
    email: "test@test.test",
    phone: '5555555555',
    company: "Company INC",
    address_1: "100 S Orange Ave",
    address_2: "",
    address_city: "Orlando",
    address_state: "FL",
    address_zip: "32811",
    address_country: "USA",
    notes: "This customer created while tokenizing a bank account",
    person_name: firstName + ' ' + lastName,
    method: "bank",
    bank_type: "savings",
    bank_name: "Bank INC",
    bank_account: accountNumber,
    bank_routing: routingNumber,
    bank_holder_type: "personal",
    total: '5'
};