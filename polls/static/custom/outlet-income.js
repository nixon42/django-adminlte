function OutletIncome() {
    // depend
    // getoutlet();
    getprem();
    var content = outletIncomeContent;
    var OutletIncomeTableObj = new TableObjTemplate();
    OutletIncomeTableObj.name = 'Outlet-Income-Table';
    OutletIncomeTableObj.jsgrid = content.find('#outlet-income-table-jsgrid');
    OutletIncomeTableObj._content = content.find('#outlet-income-table');
    OutletIncomeTableObj.dataUrl = API_URL.outlet.getdeposit;
    // OutletIncomeTableObj.insertUrl = API_URL.outlet.addoutlet;
    OutletIncomeTableObj.parseData = false;
    OutletIncomeTableObj.useEditModal = false;
    // OutletIncomeTableObj.editBtn = OutletIncomeTableObj._content.find('.tool-btn-edit');
    OutletIncomeTableObj.globalVarUpdateCB = (data) => {
        // console.log(data);
    }
    OutletIncomeTableObj.jsgridConfig = {
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
            let $row = OutletIncomeTableObj.jsgrid.find('.jsgrid-selected-row');
            if ($row.hasClass("highlight")) {
                selectedItem.splice(selectedItem.indexOf(arg.item.pk), 1);
                $row.toggleClass("highlight");
                if (selectedItem.length == 0) {
                    // console.log('hide btn');
                    validateBtn.addClass('d-none');
                }
                return;
            }

            // if (OutletIncomeTableObj.selected != null) { OutletIncomeTableObj.selected.toggleClass("highlight"); }
            if (!arg.item.validate) {
                $row.toggleClass("highlight");
                selectedItem.push(arg.item.pk);
                if (validateBtn != null && validateBtn.hasClass('d-none')) {
                    // console.log('show btn');
                    validateBtn.removeClass('d-none');
                };
            }
        },
        fields: [
            { type: 'control', editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'outlet.name', type: 'text', width: 150, headerTemplate: 'Outlet Name' },
            { name: 'employe.first_name', type: 'text', width: 120, headerTemplate: 'Officer' },
            { name: 'date', type: 'text', width: 100, headerTemplate: 'Date' },
            { name: 'fdeposit', type: 'number', width: 120, headerTemplate: 'Deposit' },
            { name: 'validate', type: 'checkbox', width: 50, headerTemplate: 'Validated' },
            { name: 'note', type: 'text', width: 200, headerTemplate: 'Note' },
        ],
        controller: {
            loadData: (filter) => {
                // console.log(TeamTableobj.data);
                return $.grep(OutletIncomeTableObj.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.outlet.name || data.outlet.name.toLowerCase().indexOf(filter.outlet.name.toLowerCase()) > -1)
                        && (!filter.employe.name || data.employe.name.toLowerCase().indexOf(filter.employe.name.toLowerCase()) > -1)
                        && (!filter.date || data.date.toLowerCase().indexOf(filter.date.toLowerCase()) > -1)
                        && (filter.validate === undefined || data.validate === filter.validate)
                        && (!filter.note || data.note.toLowerCase().indexOf(filter.note.toLowerCase()) > -1)
                });

            }
        },
    };
    OutletIncomeTableObj.init();


    // validate btn
    var validateBtn = OutletIncomeTableObj._content.find('.tool-btn-validate');
    if (PERMISSION.indexOf('outlet.can_validate_deposit') == -1) {
        validateBtn.toggleClass('d-none');
        validateBtn = null;
    }

    // form
    var depositForm = content.find('div.outlet-income-form');
    var submitBtn = depositForm.find('button.submit-btn');
    var selectedItem = [];

    var inputDom = {
        outlet: depositForm.find('select.input-outlet-select'),
        deposit: depositForm.find('input.input-deposit'),
        note: depositForm.find('textarea.input-note'),
    };

    var resetForm = () => {
        $.each(inputDom, (i, el) => {
            el.val("");
        });
    };

    submitBtn.on('click', () => {
        let data = {};
        $.each(inputDom, (k, v) => {
            data[k] = v.val();
        });
        console.log(data);

        $.ajax({
            url: API_URL.outlet.adddeposit,
            method: 'POST',
            dataType: 'json',
            data: data,
            beforeSend: function (req) {
                req.setRequestHeader("X-CSRFToken", csrftoken);
            },
        }).fail(() => {
            toastr.error('cant add deposit!, network error');
        }).done((res) => {
            if (res.return_code != 0) {
                toastr.error(`[${res.return_code}] ${res.msg}`);
                return;
            }
            resetForm();
            OutletIncomeTableObj.refreshData();
        });
    });

    validateBtn.on('click', () => {
        console.log(selectedItem);
        $.ajax({
            url: API_URL.outlet.validate,
            method: 'POST',
            async: false,
            data: { item: selectedItem },
            beforeSend: function (req) {
                req.setRequestHeader("X-CSRFToken", csrftoken);
            },
            dataType: 'json',
        }).fail(() => {
            toastr.error('cant process request, network failed');
        }).done((res) => {
            if (res.return_code != 0) {
                toastr.error(`[${res.return_code}] ${res.msg}`);
            }
            OutletIncomeTableObj.refreshData();
            validateBtn.addClass('d-none');
            selectedItem = [];
        });
    });
}