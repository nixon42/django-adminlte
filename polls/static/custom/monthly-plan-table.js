function MonthlyPlan() {
    var content = $('#monthly-plan-content');
    var MonthlyPlan = new TableObjTemplate();
    MonthlyPlan.name = 'Monthly-Plan';
    MonthlyPlan.jsgrid = content.find('#monthly-plan-table-jsgrid');
    MonthlyPlan._content = content.find('#monthly-plan-table');
    MonthlyPlan.modalSel = content.find('.monthly-plan-modal');
    MonthlyPlan.dataUrl = '/customer/getplan';
    MonthlyPlan.insertUrl = '/customer/addplan';
    MonthlyPlan.globalVarUpdateCB = (data) => {
        MONTHLY_PLAN = data;
        MONTHLY_PLAN_SELECT = [];
        MONTHLY_PLAN_SELECT.push({ pk: 0, name: '', code: '' });
        // console.log(data);
        $('.input-monthly-plan').empty();
        $('.input-monthly-plan').append('<option value="0"></option>');
        $.each(MonthlyPlan.data, (key, val) => {
            MONTHLY_PLAN_SELECT.push({ pk: val.pk, name: val.fields.name, code: val.fields.code });
            $('.input-monthly-plan').append(`<option value="${val.pk}">${val.fields.code}</option>`);
        });
    };
    MonthlyPlan.modalInput = {
        name: '.input-name',
        code: '.input-code',
        price: '.input-price',
        duration: '.input-duration',

    };
    MonthlyPlan.jsgridConfig = {
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
            let $row = MonthlyPlan.jsgrid.find('.jsgrid-selected-row');
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                MonthlyPlan.editBtn.addClass("d-none");
                MonthlyPlan.selected = null;
                MonthlyPlan.selectedItem = null;
                return
            }
            if (MonthlyPlan.selected != null) { MonthlyPlan.selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            MonthlyPlan.selected = $($row);
            MonthlyPlan.selectedItem = arg.item;
            MonthlyPlan.editBtn.removeClass("d-none");
        },
        fields: [
            // { type: 'control', width: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'fields.name', type: 'text', width: 150, headerTemplate: 'Name' },
            { name: 'fields.code', type: 'text', width: 100, headerTemplate: 'Kode Paket' },
            { name: 'fields.price', type: 'number', width: 150, headerTemplate: 'Harga' },
            { name: 'fields.duration', type: 'number', width: 80, headerTemplate: 'Durasi (Hari)' },
            { name: 'fields.sold', type: 'number', width: 80, headerTemplate: 'Terjual' },
        ],
        controller: {
            loadData: (filter) => {
                return $.grep(MonthlyPlan.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.name || data.fields.name.toLowerCase().indexOf(filter.fields.name.toLowerCase()) > -1)
                        && (!filter.fields.code || data.fields.code.toLowerCase().indexOf(filter.fields.code.toLowerCase()) > -1)
                        && (!filter.fields.price || data.fields.price === filter.fields.price)
                        && (!filter.fields.duration || data.fields.duration === filter.fields.duration)
                });
            }
        },
    };
    MonthlyPlan.init();
}