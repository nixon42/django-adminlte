function monthlyCustomer() {
    var content = monthlyCustomerContent;
    var MonthlyCustomer = new TableObjTemplate();
    let selectedPlan = null;
    MonthlyCustomer.name = 'Monthly Customer';
    MonthlyCustomer.jsgrid = content.find('#monthly-customer-table-jsgrid');
    MonthlyCustomer._content = content.find('#monthly-customer-table');
    MonthlyCustomer.modalSel = content.find('.monthly-customer-modal');
    MonthlyCustomer.dataUrl = '/customer/getmonthly';
    MonthlyCustomer.insertUrl = '/customer/addmonthly';
    MonthlyCustomer.defaultVal = {
        sdate: `${cur_date.getFullYear()}-${("0" + (cur_date.getMonth() + 1)).slice(-2)}-${("0" + (cur_date.getDate())).slice(-2)}`,
    };
    MonthlyCustomer.globalVarUpdateCB = (data) => {
        // console.log(data);
    };
    MonthlyCustomer.modalInput = {
        name: '.input-name',
        phone: '.input-phone',
        addr: '.input-addr',
        rt: '.input-rt',
        rw: '.input-rw',
        area: '.input-area',
        ap: '.input-ap',
        plan: '.input-monthly-plan',
        username: '.input-user',
        password: '.input-password',
        voucher: '.input-voucher',
        sdate: '.input-sdate',
        amount: '.input-amount',
        ddate: '.input-ddate',
        bill: '.input-bill',
        note: '.input-note'
    };
    MonthlyCustomer.jsgridConfig = {
        width: '100%',
        sorting: true,
        paging: true,
        srinkToFit: false,
        filtering: true,
        autoload: false,
        editing: false,
        noDataContent: "No Data Found",

        rowClick: function (arg) {
            // console.log(arg);
        },
        rowDoubleClick: (arg) => {
            let $row = MonthlyCustomer.jsgrid.find('.jsgrid-selected-row');
            // console.log(arg.item);
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                MonthlyCustomer.editBtn.addClass("d-none");
                MonthlyCustomer.selected = null;
                MonthlyCustomer.selectedItem = null;
                return
            }
            if (MonthlyCustomer.selected != null) { MonthlyCustomer.selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            MonthlyCustomer.selected = $($row);
            MonthlyCustomer.selectedItem = arg.item;
            MonthlyCustomer.editBtn.removeClass("d-none");
        },
        fields: [
            { type: 'control', width: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'fields.code', type: 'text', width: 150, headerTemplate: 'Code' },
            { name: 'fields.name', type: 'text', width: 150, headerTemplate: 'Name' },
            { name: 'fields.phone', type: 'text', width: 150, headerTemplate: 'Phone' },
            { name: 'fields.addr', type: 'text', width: 200, headerTemplate: 'Address' },
            { name: 'fields.rt', type: 'number', width: 80, headerTemplate: 'RT' },
            { name: 'fields.rw', type: 'number', width: 80, headerTemplate: 'RW' },
            { name: "fields.area", type: "select", width: 100, headerTemplate: 'Area', items: AREA, valueField: "pk", textField: "code" },
            { name: 'fields.ap', type: 'text', width: 200, headerTemplate: 'Access Point' },
            { name: 'fields.plan', type: 'select', width: 100, headerTemplate: 'Plan', items: MONTHLY_PLAN_SELECT, valueField: 'pk', textField: 'code' },
            { name: 'fields.username', type: 'text', width: 180, headerTemplate: 'Username' },
            { name: 'fields.password', type: 'text', width: 100, headerTemplate: 'Password' },
            { name: 'fields.voucher', type: 'text', width: 100, headerTemplate: 'Voucher' },
            { name: 'fields.sdate', type: 'text', width: 100, headerTemplate: 'Start Date' },
            { name: 'fields.ddate', type: 'text', width: 100, headerTemplate: 'Due Date' },
            { name: 'fields.bill', type: 'number', width: 100, headerTemplate: 'Bill' },
            { name: 'fields.paid', type: 'checkbox', width: 80, headerTemplate: 'Paid' },
            { name: 'fields.note', type: 'text', width: 200, headerTemplate: 'Note' },
        ],
        controller: {
            loadData: (filter) => {
                return $.grep(MonthlyCustomer.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.code || data.fields.code.toLowerCase().indexOf(filter.fields.code.toLowerCase()) > -1)
                        && (!filter.fields.name || data.fields.name.toLowerCase().indexOf(filter.fields.name.toLowerCase()) > -1)
                        && (!filter.fields.phone || data.fields.phone.indexOf(filter.fields.phone) > -1)
                        && (!filter.fields.addr || data.fields.addr.toLowerCase().indexOf(filter.fields.addr.toLowerCase()) > -1)
                        && (!filter.fields.rt || data.fields.rt === filter.fields.rt)
                        && (!filter.fields.rw || data.fields.rw === filter.field.sfieldsrw)
                        && (!filter.fields.area || data.fields.area === filter.fields.area)
                        && (!filter.fields.plan || data.fields.plan === filter.fields.plan)
                        && (!filter.fields.ap || data.fields.ap.toLowerCase().indexOf(filter.fields.ap.toLowerCase()) > -1)
                        && (!filter.fields.username || data.fields.username.toLowerCase().indexOf(filter.fields.username.toLowerCase()) > -1)
                        && (!filter.fields.password || data.fields.password.toLowerCase().indexOf(filter.fields.password.toLowerCase()) > -1)
                        && (!filter.fields.voucher || data.fields.voucher.toLowerCase().indexOf(filter.fields.voucher.toLowerCase()) > -1)
                        && (!filter.fields.sdate || data.fields.sdate.toLowerCase().indexOf(filter.fields.sdate.toLowerCase()) > -1)
                        && (!filter.fields.amount || data.fields.amount === filter.fields.amount)
                        && (!filter.fields.ddate || data.fields.ddate.toLowerCase().indexOf(filter.fields.ddate.toLowerCase()) > -1)
                        && (!filter.fields.bill || data.fields.bill === filter.fields.bill)
                        && (filter.fields.paid === undefined || data.fields.paid === filter.fields.paid)
                        && (!filter.fields.note || data.fields.note.toLowerCase().indexOf(filter.fields.note.toLowerCase()) > -1)
                });
            }
        },
    };

    MonthlyCustomer.init();

    let planInput = MonthlyCustomer.modalObj.inputDom.plan;
    let amountInput = MonthlyCustomer.modalObj.inputDom.amount;

    MonthlyCustomer.modalObj.inputDom.plan.change(() => {
        selectedPlan = $.map(MONTHLY_PLAN, (val) => { if (val.pk == planInput.val()) { return val } })[0];
    });

    MonthlyCustomer.modalObj.inputDom.amount.change(() => {
        if (selectedPlan === undefined) { toastr.error('Pilih Paket terlebih dahulu! '); return; }
        let ddate = luxon.DateTime.fromFormat(MonthlyCustomer.modalObj.inputDom.sdate.val(), 'yyyy-MM-dd');
        // console.log(ddate);
        // console.(selectedPlan.fields.duration);
        ddate = ddate.plus({ days: selectedPlan.fields.duration * amountInput.val() });
        ddate = ddate.toJSDate();
        MonthlyCustomer.modalObj.inputDom.ddate.val(`${ddate.getFullYear()}-${("0" + (ddate.getMonth() + 1)).slice(-2)}-${("0" + (cur_date.getDate())).slice(-2)}`);
    });
    CONTENT_INIT.table.area = MonthlyCustomer;
}