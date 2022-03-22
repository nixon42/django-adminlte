function inventoryContent() {
    var content = $('#inventory-content');
    var InventoryType = new TableObjTemplate();
    InventoryType.name = 'InventoryType';
    // InventoryType.data = InventoryTypeData;
    InventoryType.jsgrid = content.find('#inventory-type-table-jsgrid');
    InventoryType._content = content.find('#inventory-type-table');
    InventoryType.modalSel = content.find('.inventory-type-modal');
    InventoryType.globalVarUpdateCB = (data) => {
        INVEN_TYPE_DATA = [];
        INVEN_TYPE_DATA.push({ pk: 0, name: '' });
        // console.log(data);
        $('.input-inven-t').empty();
        $('.input-inven-t').append('<option value="0"></option>');
        $.each(InventoryType.data, (key, val) => {
            INVEN_TYPE_DATA.push({ pk: val.pk, name: val.fields.name });
            $('.input-inven-t').append(`<option value="${val.pk}">${val.fields.name}</option>`);
        });
    };
    // InventoryType.inputOptDom = '.input-inven-t';
    InventoryType.dataUrl = '/getinvent';
    InventoryType.insertUrl = '/addinvent';
    InventoryType.modalInput = {
        name: '.input-name',
    };
    InventoryType.jsgridConfig = {
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
            let $row = InventoryType.jsgrid.find('.jsgrid-selected-row');
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                InventoryType.editBtn.addClass("d-none");
                InventoryType.selected = null;
                InventoryType.selectedItem = null;
                return
            }
            if (InventoryType.selected != null) { InventoryType.selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            InventoryType.selected = $($row);
            InventoryType.selectedItem = arg.item;
            InventoryType.editBtn.removeClass("d-none");
        },
        fields: [
            // { type: 'control', width: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'fields.name', type: 'text', width: 150, headerTemplate: 'Name' },
        ],
        controller: {
            loadData: (filter) => {
                return $.grep(InventoryType.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.name || data.fields.name.toLowerCase().indexOf(filter.fields.name.toLowerCase()) > -1)
                });
            }
        },
    };
    InventoryType.init();

    var Inventory = new TableObjTemplate();
    Inventory.name = 'Inventory';
    Inventory.jsgrid = content.find('#inventory-table-jsgrid');
    Inventory._content = content.find('#inventory-table');
    Inventory.modalSel = content.find('.inventory-modal');
    Inventory.dataUrl = '/getinven';
    Inventory.insertUrl = '/addinven';
    Inventory.globalVarUpdateCB = (data) => {
        // console.log(data);
        // return;
        let search = {
            'Router': {
                selector: '.input-router',
                variable: (data) => {
                    INVEN_ROUTER = [];
                    INVEN_ROUTER.push({ pk: 0, name: '' });
                    $.each(data, (key, val) => {
                        INVEN_ROUTER.push({ pk: val.pk, name: val.fields.name });
                    });
                }
            },
            'Konverter': {
                selector: '.input-converter',
                variable: (data) => {
                    INVEN_KONVERTER = [];
                    INVEN_KONVERTER.push({ pk: 0, name: '' });
                    $.each(data, (key, val) => {
                        INVEN_KONVERTER.push({ pk: val.pk, name: val.fields.name });
                    });
                }
            }
        };
        $.each(search, (key, val) => {
            $(val.selector).empty();
            $(val.selector).append('<option value="0"></option>');
            // console.log(INVEN_TYPE_DATA);
            $.each(INVEN_TYPE_DATA, (_key, _type) => {
                if (_type.name == key) {
                    // console.log(data);
                    let _inven = [];
                    $.each(data, (data_key, data_val) => {
                        if (data_val.fields.type == _type.pk) {
                            _inven.push(data_val);
                        }
                    });
                    // console.log(_inven);
                    val.variable(_inven);
                    $.each(_inven, (_, v) => {
                        $(val.selector).append(`<option value="${v.pk}">${v.fields.name}</option>`);
                    }
                    );
                }
            });
        });
    };
    Inventory.modalInput = {
        name: '.input-name',
        stock: '.input-stock',
        type: '.input-inven-t'
    };
    Inventory.jsgridConfig = {
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
            // console.log(arg.item);
            let $row = Inventory.jsgrid.find('.jsgrid-selected-row');
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                Inventory.editBtn.addClass("d-none");
                Inventory.selected = null;
                Inventory.selectedItem = null;
                return
            }
            if (Inventory.selected != null) { Inventory.selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            Inventory.selected = $($row);
            Inventory.selectedItem = arg.item;
            Inventory.editBtn.removeClass("d-none");
        },
        fields: [
            // { type: 'control', with: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'fields.name', type: 'text', width: 200, headerTemplate: 'Name' },
            { name: 'fields.type', type: 'select', items: INVEN_TYPE_DATA, width: 150, headerTemplate: 'Type', valueField: 'pk', textField: 'name' },
            { name: 'fields.stock', type: 'number', width: 100, headerTemplate: 'Stock' },
        ],
        controller: {
            loadData: (filter) => {
                // console.log(filter);
                console.log(`[${Inventory.name}] Load data`);
                return $.grep(Inventory.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.name || data.fields.name.toLowerCase().indexOf(filter.fields.name.toLowerCase()) > -1)
                        && (!filter.fields.type || data.fields.type === filter.fields.type)
                        && (!filter.fields.stock || data.fields.stock === filter.fields.stock)
                });
            },
        },
    };
    // console.log(INVEN_TYPE_DATA);
    Inventory.init();

    CONTENT_INIT.table.invent = InventoryType;
    CONTENT_INIT.table.inven = Inventory;
}
