
function CustomerReport() {
    var content = monthlyCustomerReportContent;
    var infoBox = content.find('.customer-info');
    var filter = content.find('.customer-report-filter');
    var filterSubmitBtn = filter.find('.btn-submit');
    var messageBtn = content.find('.tool-message-btn');
    var table = content.find('#customer-report-jsgrid');

    var filterDom = {
        dueRange: filter.find('.input-due-range'),
    };

    var infoBoxDom = {
        totalCustomer: infoBox.find('.total-customer'),
        newCustomer: infoBox.find('.new-customer'),
        paidCustomer: infoBox.find('.paid-customer'),
        paidCustomerPercent: infoBox.find('.paid-customer-percent'),
        dueCustomer: infoBox.find('.due-customer'),
    };

    // get info
    $.ajax({
        url: API_URL.customer_report.getInfo,
        method: 'GET',
        dataType: 'json'
    }).fail(() => {
        toastr.error('Failed to get customer info!');
    }).done((data) => {
        if (data.return_code != 0) {
            toastr.error(`Failed to get customer info, code ${data.return_code}`);
            return
        }
        $.each(infoBoxDom, (key, val) => {
            try {
                val.text(data.data[key].toLocaleString('en-US'));
            } catch (error) {

            }
        });
        infoBoxDom.paidCustomerPercent.text(parseInt(data.data.paidCustomer / data.data.totalCustomer * 100));
    });

    // TODO : add dude customer table
    // let tableDom = table.find('#customer-report-jsgrid');
    let selectedDom = null;
    let selectedItem = null;
    let dueCustomer = [];
    messageBtn.on('click', () => {
        if (selectedItem == null || selectedItem.fields.phone == '') {
            toastr.error('invlid phone number');
            return
        }
        // console.log(`http://wa.me/${selectedItem.fields.phone}`);
        window.open(`http://wa.me/${selectedItem.fields.phone}`, '_blank').focus();
    });
    let getDueCustomer = () => {
        let filter_data = {};
        $.each(filterDom, (key, val) => {
            filter_data[key] = val.val();
        });
        // console.log(filter_data);
        // if (filter_data == '' || filter_data == null) {
        //     toastr.error('Invalid Due Range !');
        //     return
        // }
        $.ajax({
            method: 'POST',
            url: API_URL.customer_report.filter,
            data: filter_data,
            dataType: 'json',
            beforeSend: (req) => { req.setRequestHeader('X-CSRFToken', csrftoken); },
        }).fail(() => {
            toastr.error('failed to get data!');
        }).done(
            (ret_data) => {
                console.log('Done get customer report Data');
                if (ret_data.return_code != 0) {
                    toastr.error(`[ ERR ${ret_data.return_code}] ${ret_data.msg}`);
                    return
                }
                dueCustomer = JSON.parse(ret_data.data);
                // console.log(dueCustomer);
                table.jsGrid('loadData');
                messageBtn.addClass('d-none');
            }
        );
    }

    table.jsGrid({
        width: '100%',
        sorting: true,
        paging: true,
        srinkToFit: false,
        filtering: true,
        autoload: false,
        editing: false,
        noDataContent: "No Data",
        rowClick: function (arg) {
            // console.log(arg);
        },
        rowDoubleClick: (arg) => {
            let $row = table.find('.jsgrid-selected-row');
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                messageBtn.toggleClass('d-none')
                selectedDom = null;
                selectedItem = null;
                return
            }
            if (selectedDom != null) { selectedDom.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            messageBtn.toggleClass('d-none');
            selectedDom = $($row);
            selectedItem = arg.item;
        },
        fields: [
            { type: 'control', width: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            // { name: 'fields.code', type: 'text', width: 150, headerTemplate: 'Code' },
            { name: 'fields.name', type: 'text', width: 150, headerTemplate: 'Name' },
            { name: 'fields.phone', type: 'text', width: 150, headerTemplate: 'Phone' },
            // { name: 'fields.addr', type: 'text', width: 200, headerTemplate: 'Address' },
            { name: 'fields.rt', type: 'number', width: 80, headerTemplate: 'RT' },
            // { name: 'fields.rw', type: 'number', width: 80, headerTemplate: 'RW' },
            // { name: "fields.area", type: "select", width: 100, headerTemplate: 'Area', items: AREA, valueField: "pk", textField: "code" },
            // { name: 'fields.ap', type: 'text', width: 200, headerTemplate: 'Access Point' },
            { name: 'fields.plan', type: 'select', width: 100, headerTemplate: 'Plan', items: MONTHLY_PLAN_SELECT, valueField: 'pk', textField: 'code' },
            // { name: 'fields.username', type: 'text', width: 180, headerTemplate: 'Username' },
            // { name: 'fields.password', type: 'text', width: 100, headerTemplate: 'Password' },
            // { name: 'fields.voucher', type: 'text', width: 100, headerTemplate: 'Voucher' },
            // { name: 'fields.sdate', type: 'text', width: 100, headerTemplate: 'Start Date' },
            { name: 'fields.ddate', type: 'text', width: 100, headerTemplate: 'Due Date' },
            { name: 'fields.bill', type: 'number', width: 100, headerTemplate: 'Bill' },
            { name: 'fields.paid', type: 'checkbox', width: 80, headerTemplate: 'Paid' },
            // { name: 'fields.note', type: 'text', width: 200, headerTemplate: 'Note' },
        ],
        controller: {
            loadData: (filter) => {
                return $.grep(dueCustomer, (data) => {
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
    });
    getDueCustomer();
    filterSubmitBtn.on('click', getDueCustomer);

    var filterPreset = {
        day: filter.find('.filter-preset-day'),
        week: filter.find('.filter-preset-week'),
        month: filter.find('.filter-preset-month'),
        last: filter.find('.filter-preset-last'),
    };

    filterPreset.week.on('click', () => {
        filterDom.dueRange.data('daterangepicker').setStartDate(moment().startOf('week'));
        filterDom.dueRange.data('daterangepicker').setEndDate(moment().endOf('week'));
        getDueCustomer();
    });
    filterPreset.day.on('click', () => {
        filterDom.dueRange.data('daterangepicker').setStartDate(moment());
        filterDom.dueRange.data('daterangepicker').setEndDate(moment());
        getDueCustomer();
    });
    filterPreset.month.on('click', () => {
        filterDom.dueRange.data('daterangepicker').setStartDate(moment().startOf('month'));
        filterDom.dueRange.data('daterangepicker').setEndDate(moment().endOf('month'));
        getDueCustomer();
    });

    filterPreset.last.on('click', () => {
        filterDom.dueRange.data('daterangepicker').setStartDate(moment().subtract(3, 'month').startOf('month'));
        filterDom.dueRange.data('daterangepicker').setEndDate(moment().startOf('month'));
        getDueCustomer();
    });
}