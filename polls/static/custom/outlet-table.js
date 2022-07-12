function OutletContent() {
    // depend
    // getarea();

    var content = outletTableContent;
    var OutletTableObj = new TableObjTemplate();
    OutletTableObj.name = 'Outlet-Table';
    OutletTableObj.jsgrid = content.find('#outlet-table-jsgrid');
    OutletTableObj._content = content.find('#outlet-table');
    // OutletTableObj.modalSel = content.find('.team-table-modal');
    OutletTableObj.dataUrl = API_URL.outlet.getoutlet;
    OutletTableObj.insertUrl = API_URL.outlet.addoutlet;
    OutletTableObj.parseData = false;
    OutletTableObj.useEditModal = false;
    OutletTableObj.editBtn = OutletTableObj._content.find('.tool-btn-edit');

    OutletTableObj.globalVarUpdateCB = (data) => {
        // console.log(data);
        OUTLET = data;
        OUTLET.unshift({ pk: 0, name: "" });
        $('input.input-outlet-select').empty();
        $.each(OUTLET, (k, v) => {
            $('input.input-outlet-select').append(`<option value=${v.id}>${v.name}</option>`);
        });
    };

    OutletTableObj.jsgridConfig = {
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
            let $row = OutletTableObj.jsgrid.find('.jsgrid-selected-row');
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                OutletTableObj.editBtn.addClass("d-none");
                OutletTableObj.selected = null;
                OutletTableObj.selectedItem = null;
                return
            }
            if (OutletTableObj.selected != null) { OutletTableObj.selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            OutletTableObj.selected = $($row);
            OutletTableObj.selectedItem = arg.item;
            // console.log(arg.item);
            OutletTableObj.editBtn.removeClass("d-none");
        },
        fields: [
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'name', type: 'text', width: 150, headerTemplate: 'Outlet Name' },
            { name: 'phone', type: 'text', width: 150, headerTemplate: 'Phone' },
            { name: 'address', type: 'text', width: 100, headerTemplate: 'Address' },
            { name: 'rt', type: 'number', width: 100, headerTemplate: 'RT' },
            { name: 'rw', type: 'number', width: 100, headerTemplate: 'RW' },
            { name: 'area', type: 'select', width: 100, headerTemplate: 'Area', items: AREA, valueField: 'pk', textField: 'code' },
            { name: 'lastdeposit', type: 'text', width: 100, headerTemplate: 'Last Deposit' },
            { name: 'ftotalincome', type: 'text', width: 150, headerTemplate: 'Total Income' },
            { name: 'note', type: 'text', width: 200, headerTemplate: 'Note' },
        ],
        controller: {
            loadData: (filter) => {
                // console.log(TeamTableobj.data);
                return $.grep(OutletTableObj.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.name || data.name.toLowerCase().indexOf(filter.name.toLowerCase()) > -1)
                        && (!filter.rt || data.rt === filter.rt)
                        && (!filter.rw || data.rw === filter.rw)
                        && (!filter.area || data.area === filter.area)
                    // && (!filter.fields.lastname || data.fields.last_name.toLowerCase().indexOf(filter.fields.last_name.toLowerCase()) > -1)
                    // && (!filter.fields.username || data.fields.username.toLowerCase().indexOf(filter.fields.username.toLowerCase()) > -1)
                    // && (!filter.fields.role.id || data.fields.role.id === filter.fields.role.id)
                });

            }
        },
    };
    OutletTableObj.init();

    var form = content.find('.outlet-form');
    var submitbtn = form.find('button.submit-btn');
    var resetbtn = form.find("button.reset-btn");
    var inputDom = {
        'name': form.find('input.input-name'),
        'phone': form.find('input.input-phone'),
        'addr': form.find('input.input-addr'),
        'rt': form.find('input.input-rt'),
        'rw': form.find('input.input-rw'),
        'area': form.find('select.input-area'),
        'lastdeposit': form.find('input.input-last-deposit'),
        'totalincome': form.find('input.input-income'),
        'note': form.find('textarea.input-note'),
    };

    var resetForm = () => {
        $.each(inputDom, (i, el) => {
            el.val("");
        });
    };

    var showItem = (item) => {
        $.each(inputDom, (k, v) => {
            v.val(item[k]);
        });
    };
    OutletTableObj.editBtn.on('click', () => {
        showItem(OutletTableObj.selectedItem);
    });

    resetbtn.on('click', resetForm);

    submitbtn.on('click', () => {
        let data = {};
        $.each(inputDom, (k, v) => {
            data[k] = v.val();
        });
        data.new = OutletTableObj.selectedItem === null;

        if (!data.new) {
            data.pk = OutletTableObj.selectedItem.pk;
        }
        else {
            data.pk = 0;
        }
        console.log(data);
        $.ajax({
            url: API_URL.outlet.addoutlet,
            dataType: 'json',
            method: 'POST',
            data: data,
            beforeSend: function (req) {
                req.setRequestHeader("X-CSRFToken", csrftoken);
            },
        }).fail(() => {
            toastr.error('cant add item!, network fail');
        }).done((res) => {
            if (res.return_code != 0) {
                toastr.error(`[${res.return_code}] ${res.msg}`);
                return;
            }
            resetForm();
            OutletTableObj.selectedItem = null;
            OutletTableObj.refreshData();
        });
    });
}