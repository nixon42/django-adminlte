function monthlyForm() {
    var _content = $('#monthly-form-content');
    var submitBtn = _content.find('.submit-btn');
    var table = _content.find('#transaction-table-jsgrid');
    var inputTotal = _content.find('.input-total');

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
    inputDom.cash.on('input', () => {
        let n = parseInt(inputDom.cash.val().replaceAll(',', ''));
        // console.log(n.toLocaleString());
        if (n != n) {
            inputDom.return.val('');
            inputDom.bill.val('');
            return
        }
        inputDom.cash.val(n.toLocaleString());
        cash = n;
        if (cash >= _bill) {
            bill = 0;
            inputDom.return.val((cash - _bill).toLocaleString());
        }
        else {
            inputDom.return.val('');
            bill = _bill - cash;
        }
        inputDom.bill.val(bill.toLocaleString());
    });

    inputDom.amount.change(() => {
        amount = inputDom.amount.val();
        _bill = plan.fields.price * amount;
        inputTotal.val(_bill.toLocaleString());
        bill = _bill - cash;
        if (cash >= bill) {
            inputDom.return.val(cash - _bill);
        }
        else {
            inputDom.return.val('');
        }
        inputDom.bill.val(bill.toLocaleString());

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
        let data = {
            customer: inputDom.customer.val(),
            plan: inputDom.plan.val(),
            amount: inputDom.amount.val(),
            cash: inputDom.cash.val().replaceAll(',', ''),
            bill: 0,
            ret: 0
        };

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
                inputTotal.val('');
                bill = 0;
                _bill = 0;
                cash = 0;
                amount = 0;
                plan = null;
                getcustomer();
                table.jsGrid('loadData');
            }
        });
    });

    // transacion log
    var transactionLog = [];

    table.jsGrid({
        width: '100%',
        sorting: true,
        paging: true,
        srinkToFit: false,
        editing: false,
        autoload: true,
        noDataContent: "No Data",
        fields: [
            { name: 'id', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'customer.name', type: 'text', width: 150, headerTemplate: 'Customer' },
            { name: 'plan.code', type: 'text', width: 100, headerTemplate: 'Plan' },
            { name: 'amount', type: 'number', width: 80, headerTemplate: 'Amount' },
            { name: 'total', type: 'number', width: 150, headerTemplate: 'Total' },
            { name: 'cash', type: 'number', width: 150, headerTemplate: 'Cash' },
            { name: 'ret', type: 'number', width: 150, headerTemplate: 'Return' },
        ],
        controller: {
            loadData: (filter) => {
                $.ajax({
                    method: 'GET',
                    url: API_URL.form.getTransactionLog,
                    async: false,
                    // dataType: 'json',
                    // accepts: 'json',
                }).fail(() => {
                    toastr.error('Failed to get transaction log!');
                    transactionLog = [];
                }).done((res) => {
                    console.log('done get transaction log');
                    if (res.return_code != 0) {
                        toastr.error(`[${res.return_code}] ${res.msg}`);
                        return []
                    }
                    // console.log({ data: [{ d: 1 }] });
                    transactionLog = res.data;
                });
                // console.log(transactionLog);
                return transactionLog;
                // return [{ id: 1 }];
            }
        }
    });
    // table.jsGrid('loadData');
}