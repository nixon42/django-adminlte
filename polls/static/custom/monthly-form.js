function monthlyForm() {
    var _content = $('#monthly-form-content');
    var submitBtn = _content.find('.submit-btn');
    var inputDom = {
        customer: _content.find('.input-customer-select'),
        plan: _content.find('.input-monthly-plan'),
        amount: _content.find('.input-amount'),
        cash: _content.find('.input-cash'),
        return: _content.find('.input-return'),
        bill: _content.find('.input-bill'),
    };

    let _bill = 0;
    let bill = 0;
    let cash = 0;
    let amount = 0;
    let plan = null;
    inputDom.cash.change(() => {
        cash = inputDom.cash.val();
        if (cash >= _bill) {
            bill = 0;
            inputDom.return.val(cash - _bill);
        }
        else {
            inputDom.return.val('');
            bill = _bill - cash;
        }
        inputDom.bill.val(bill);
    });
    inputDom.amount.change(() => {
        amount = inputDom.amount.val();
        _bill = plan.fields.price * amount;
        bill = _bill - cash;
        if (cash >= bill) {
            inputDom.return.val(cash - _bill);
        }
        else {
            inputDom.return.val('');
        }
        inputDom.bill.val(bill);

    });
    inputDom.customer.change(() => {
        $.map(MONTHLY_CUSTOMER, (val) => {
            // console.log(val);
            if (inputDom.customer.val() == val.pk) {
                inputDom.plan.val(val.fields.plan).change();
                inputDom.amount.val(1).change();
            }
        });
    });
    inputDom.plan.change(() => {
        $.map(MONTHLY_PLAN, (val) => {
            if (val.pk == inputDom.plan.val()) {
                plan = val;
            }
        });
    });
    submitBtn.click(() => {
        let data = {};
        $.each(inputDom, (key, val) => {
            data[key] = val.val();
        });

        $.ajax({
            url: API_URL.monthly_customer.form,
            method: 'POST',
            data: data,
            dataType: 'json',
            beforeSend: (req) => { req.setRequestHeader('X-CSRFToken', csrftoken); },
        }).fail(() => {
            toastr.error(`failed to process transaction`);
        }).done((res) => {
            if (res.return_code != 0) {
                toastr.error(`transaction failed, ${res.msg}`);
            }
            else {
                toastr.success(`Transaction success!`);
                $.each(inputDom, (key, val) => {
                    if (val.is('select')) { val.val(0).change(); return; }
                    val.val('');
                });
                bill = 0;
                _bill = 0;
                cash = 0;
                amount = 0;
                plan = null;
            }
        });
    });
}