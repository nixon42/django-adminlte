function NewCustomerForm() {
    var _content = $('#new-customer-form-content');
    var submitBtn = _content.find('.submit-btn');
    var table = _content.find('#new-customer-table-jsgrid');
    // var inputTotal = _content.find('.input-total');


    var inputDom = {
        name: _content.find('.input-name'),
        phone: _content.find('.input-phone'),
        addr: _content.find('.input-addr'),
        rt: _content.find('.input-rt'),
        rw: _content.find('.input-rw'),
        area: _content.find('.input-area'),
        ap: _content.find('.input-ap'),
        plan: _content.find('.input-monthly-plan'),
        username: _content.find('.input-username'),
        password: _content.find('.input-password'),
    };

    submitBtn.click(() => {
        let data = {};
        $.each(inputDom, (key, val) => {
            data[key] = val.val();
        });
        data.voucher = '';
        data.sdate = '';
        data.amount = '';
        data.ddate = '';
        data.note = '';

        $.ajax({
            url: API_URL.monthly_customer.add,
            method: 'POST',
            data: data,
            dataType: 'json',
            beforeSend: (req) => { req.setRequestHeader('X-CSRFToken', csrftoken); },
        }).fail(() => {
            toastr.error(`failed to register customer`);
        }).done((res) => {
            if (res.return_code != 0) {
                toastr.error(`registration failed, ${res.msg}`);
            }
            else {
                toastr.success(`Registration success!`);
                $.each(inputDom, (key, val) => {
                    if (val.is('select')) { val.val(0).change(); return; }
                    val.val('');
                });
                table.jsGrid('loadData');
            }
        });
    });

    // transacion table
    var newCustomerLog = [];

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
            // { name: 'fields.code', type: 'text', width: 150, headerTemplate: 'Code' },
            { name: 'name', type: 'text', width: 150, headerTemplate: 'Name' },
            { name: 'phone', type: 'text', width: 150, headerTemplate: 'Phone' },
            { name: 'addr', type: 'text', width: 200, headerTemplate: 'Address' },
            { name: 'rt', type: 'number', width: 80, headerTemplate: 'RT' },
            { name: 'rw', type: 'number', width: 80, headerTemplate: 'RW' },
            { name: "area", type: "select", width: 100, headerTemplate: 'Area', items: AREA, valueField: "pk", textField: "code" },
            // { name: 'fields.ap', type: 'text', width: 200, headerTemplate: 'Access Point' },
            { name: 'plan.code', type: 'text', width: 100, headerTemplate: 'Plan' },
            // { name: 'fields.username', type: 'text', width: 180, headerTemplate: 'Username' },
            // { name: 'fields.password', type: 'text', width: 100, headerTemplate: 'Password' },
            // { name: 'fields.voucher', type: 'text', width: 100, headerTemplate: 'Voucher' },
            // { name: 'fields.sdate', type: 'text', width: 100, headerTemplate: 'Start Date' },
            // { name: 'fields.paid', type: 'checkbox', width: 80, headerTemplate: 'Paid' },
            // { name: 'fields.note', type: 'text', width: 200, headerTemplate: 'Note' },
        ],
        controller: {
            loadData: (filter) => {
                $.ajax({
                    method: 'GET',
                    url: API_URL.monthly_customer.newcustomerlog,
                    async: false,
                    // dataType: 'json',
                    // accepts: 'json',
                }).fail(() => {
                    toastr.error('Failed to get new customer log!');
                    transactionLog = [];
                }).done((res) => {
                    console.log('done get new customer log');
                    if (res.return_code != 0) {
                        toastr.error(`[${res.return_code}] ${res.msg}`);
                        return
                    }
                    // console.log(res);
                    newCustomerLog = res.data;
                });
                // console.log(transactionLog);
                return newCustomerLog;
                // return [{ id: 1 }];
            }
        }
    });
    // table.jsGrid('loadData');
}