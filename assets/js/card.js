var payButton = document.querySelector('#paybutton');
var tokenizeButton = document.querySelector('#tokenizebutton');

// Init StaxJs SDK
var staxJs = new StaxJs('software-developer-6e4db5b06b6e', {
  number: {
    id: 'staxjs-number',
    placeholder: '0000 0000 0000 0000',
    style: 'width: 90%; height:90%; border-radius: 3px; border: 1px solid #ccc; padding: .5em .5em; font-size: 91%;'
  },
  cvv: {
    id: 'staxjs-cvv',
    placeholder: '000',
    style: 'width: 30px; height:90%; border-radius: 3px; border: 1px solid #ccc; padding: .5em .5em; font-size: 91%;'
  }
});

// tell staxJs to load in the card fields
staxJs.showCardForm().then(handler => {
  console.log('form loaded');

  // for testing!
  handler.setTestPan('4111111111111111');
  handler.setTestCvv('123');
  var form = document.querySelector('form');
  form.querySelector('input[name=month]').value = 11;
  form.querySelector('input[name=year]').value = 2025;
  form.querySelector('input[name=cardholder-first-name]').value = 'Jon';
  form.querySelector('input[name=cardholder-last-name]').value = 'Doe';
  form.querySelector('input[name=phone]').value = '+1111111111111111';
})
.catch(err => {
  console.log('error init form ' + err);
  // reinit form
});

staxJs.on('card_form_complete', (message) => {
  // activate pay button
  payButton.disabled = false;
  tokenizeButton.disabled = false;
  console.log(message);
});

staxJs.on('card_form_uncomplete', (message) => {
  // deactivate pay button
  payButton.disabled = true;
  tokenizeButton.disabled = true;
  console.log(message);
});

document.querySelector('#paybutton').onclick = () => {
  var successElement = document.querySelector('.success');
  var errorElement = document.querySelector('.error');
  var loaderElement = document.querySelector('.loader');

  successElement.classList.remove('visible');
  errorElement.classList.remove('visible');
  loaderElement.classList.add('visible');

  var form = document.querySelector('form');
  var extraDetails = {
    total: 1, // 1$
    firstname: form.querySelector('input[name=cardholder-first-name]').value,
    lastname: form.querySelector('input[name=cardholder-last-name]').value,
    company: '',
    email: '',
    month: form.querySelector('input[name=month]').value,
    year: form.querySelector('input[name=year]').value,
    phone: form.querySelector('input[name=phone]').value,
    address_1: '100 S Orange Ave',
    address_2: '',
    address_city: 'Orlando',
    address_state: 'FL',
    address_zip: '32811',
    address_country: 'USA',
    url: "https://app.staxpayments.com/#/bill/",
    method: 'card',
    // validate is optional and can be true or false. 
    // determines whether or not stax.js does client-side validation.
    // the validation follows the sames rules as the api.
    // check the api documentation for more info:
    // https://staxpayments.com/api-documentation/
    validate: false,
    // meta is optional and each field within the POJO is optional also
    meta: {
      reference: 'invoice-reference-num',// optional - will show up in emailed receipts
      memo: 'notes about this transaction',// optional - will show up in emailed receipts
      otherField1: 'other-value-1', // optional - we don't care
      otherField2: 'other-value-2', // optional - we don't care
      subtotal: 1, // optional - will show up in emailed receipts
      tax: 0, // optional - will show up in emailed receipts
      lineItems: [ // optional - will show up in emailed receipts
        {"id": "optional-fm-catalog-item-id", "item":"Demo Item","details":"this is a regular, demo item","quantity":10,"price":.1}
      ] 
    }
  };
  
  console.log(extraDetails);

  // call pay api
  staxJs.pay(extraDetails).then((result) => {
    console.log('pay:');
    console.log(result);
    if (result.id) {
      successElement.querySelector('.token').textContent = result.payment_method_id;
      successElement.classList.add('visible');
      loaderElement.classList.remove('visible');
    }
  })
  .catch(err => {
    // if a transaction did occur, but errored, the error will be in the message of the first child transactoin
    if (err.payment_attempt_message) {
      errorElement.textContent = err.payment_attempt_message;
    } else {
      // else, there may have been a validation error - and tokenization failed
      // err can contain an object where each key is a field name that points to an array of errors
      // such as {phone_number: ['The phone number is invalid']}
      errorElement.textContent = typeof err === 'object' ? err.message || Object.keys(err).map((k) => err[k].join(' ')).join(' ') : JSON.stringify(err);
    }

    errorElement.classList.add('visible');
    loaderElement.classList.remove('visible');
  });
}

document.querySelector('#tokenizebutton').onclick = () => {
  var successElement = document.querySelector('.success');
  var errorElement = document.querySelector('.error');
  var loaderElement = document.querySelector('.loader');

  successElement.classList.remove('visible');
  errorElement.classList.remove('visible');
  loaderElement.classList.add('visible');

  var form = document.querySelector('form');
  var extraDetails = {
    total: 1, // 1$
    firstname: form.querySelector('input[name=cardholder-first-name]').value,
    lastname: form.querySelector('input[name=cardholder-last-name]').value,
    month: form.querySelector('input[name=month]').value,
    year: form.querySelector('input[name=year]').value,
    phone: form.querySelector('input[name=phone]').value,
    address_1: '100 S Orange Ave',
    address_2: '',
    address_city: 'Orlando',
    address_state: 'FL',
    address_zip: '32811',
    address_country: 'USA',
    url: "https://app.staxpayments.com/#/bill/",
    method: 'card',
    // validate is optional and can be true or false. 
    // determines whether or not stax.js does client-side validation.
    // the validation follows the sames rules as the api.
    // check the api documentation for more info:
    // https://staxpayments.com/api-documentation/
    validate: false, 
  };

  // call tokenize api
  staxJs.tokenize(extraDetails).then((result) => {
    console.log('tokenize:');
    console.log(result);
    if (result) {
        successElement.querySelector('.token').textContent = result.id;
        successElement.classList.add('visible');
    }
    loaderElement.classList.remove('visible');
  })
  .catch((err) => {
    // err can contain an object where each key is a field name that points to an array of errors
    // such as {phone_number: ['The phone number is invalid']}
    errorElement.textContent = typeof err === 'object' ? err.message || Object.keys(err).map((k) => err[k].join(' ')).join(' ') : JSON.stringify(err);
    errorElement.classList.add('visible');
    loaderElement.classList.remove('visible');
  });
}