function monthlyCustomer() {
    var content = monthlyCustomerContent;
    var MonthlyCustomer = new TableObjTemplate();
    MonthlyCustomer.name = 'Monthly Customer';
    MonthlyCustomer.jsgrid = content.find('#monthly-customer-table-jsgrid');
    MonthlyCustomer._content = content.find('#monthly-customer-table');
    MonthlyCustomer.modalSel = content.find('.monthly-customer-modal');
    MonthlyCustomer.dataUrl = '/customer/getmonthly';
    MonthlyCustomer.insertUrl = '/customer/addmonthly';
    MonthlyCustomer.globalVarUpdateCB = (data) => {
    };
    MonthlyCustomer.modalInput = {
        name: '.input-name',
        phone: '.input-phone',
        addr: '.input-addr',
        rt: '.input-rt',
        rw: '.input-rw',
        area: '.input-area',
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
            // let $row = InventoryType.jsgrid.rowByItem(arg.item);
            let $row = MonthlyCustomer.jsgrid.find('.jsgrid-selected-row');
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
            // { type: 'control', width: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'fields.name', type: 'text', width: 150, headerTemplate: 'Name' },
            { name: 'fields.phone', type: 'text', width: 100, headerTemplate: 'Phone' },
            { name: 'fields.addr', type: 'text', width: 100, headerTemplate: 'Address' },
            { name: 'fields.rt', type: 'number', width: 80, headerTemplate: 'RT' },
            { name: 'fields.rw', type: 'number', width: 80, headerTemplate: 'RW' },
            { name: 'fields.area', type: 'select', width: 100, headerTemplate: 'Area' },
            { name: 'fields.username', type: 'text', width: 100, headerTemplate: 'Username' },
            { name: 'fields.password', type: 'text', width: 100, headerTemplate: 'Password' },
            { name: 'fields.voucher', type: 'text', width: 100, headerTemplate: 'Voucher' },
            { name: 'fields.sdate', type: 'text', width: 100, headerTemplate: 'Start Date' },
            { name: 'fields.amount', type: 'text', width: 100, headerTemplate: 'Address' },
            { name: 'fields.ddate', type: 'text', width: 100, headerTemplate: 'Stop Date' },
            { name: 'fields.bill', type: 'number', width: 100, headerTemplate: 'Bill' },
            { name: 'fields.note', type: 'text', width: 200, headerTemplate: 'Note' },
        ],
        controller: {
            loadData: (filter) => {
                return $.grep(MonthlyCustomer.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.name || data.fields.name.toLowerCase().indexOf(filter.fields.name.toLowerCase()) > -1)
                        && (!filter.fields.phone || data.fields.phone.indexOf(filter.fields.phone) > -1)
                        && (!filter.fields.addr || data.fields.addr.toLowerCase().indexOf(filter.fields.addr.toLowerCase()) > -1)
                        && (!filter.field.rt || data.field.rt === filter.field.rt)
                        && (!filter.field.rw || data.field.rw === filter.field.rw)
                        && (filter.field.rw === undefined || data.field.area === filter.field.area)
                        && (!filter.fields.username || data.fields.username.toLowerCase().indexOf(filter.fields.username.toLowerCase()) > -1)
                        && (!filter.fields.password || data.fields.password.toLowerCase().indexOf(filter.fields.password.toLowerCase()) > -1)
                        && (!filter.fields.voucher || data.fields.voucher.toLowerCase().indexOf(filter.fields.voucher.toLowerCase()) > -1)
                        && (!filter.fields.sdate || data.fields.sdate.toLowerCase().indexOf(filter.fields.sdate.toLowerCase()) > -1)
                        && (!filter.fields.amount || data.fields.amount === filter.fields.amount)
                        && (!filter.fields.ddate || data.fields.ddate.toLowerCase().indexOf(filter.fields.ddate.toLowerCase()) > -1)
                        && (!filter.fields.bill || data.fields.bill === filter.fields.bill)
                        && (!filter.fields.note || data.fields.note.toLowerCase().indexOf(filter.fields.note.toLowerCase()) > -1)
                });
            }
        },
    };
    MonthlyCustomer.init();
    CONTENT_INIT.table.area = MonthlyCustomer;
}