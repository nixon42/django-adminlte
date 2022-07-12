function netwatchContent() {
    var content = $('#netwatch-content');
    var Netwatch = new TableObjTemplate();
    Netwatch.name = 'Netwacth';
    Netwatch.jsgrid = content.find('#netwatch-table-jsgrid');
    Netwatch._content = content.find('#netwatch-table');
    Netwatch.useEditModal = false;
    Netwatch.dataUrl = '/getapup';
    Netwatch.globalVarUpdateCB = (data) => {
        NETWATCH_DATA = data;
    };
    Netwatch.jsgridConfig = {
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
            let $row = Netwatch.jsgrid.find('.jsgrid-selected-row');
            // console.log(arg.item);
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                // Netwatch.editBtn.addClass("d-none");
                Netwatch.selected = null;
                Netwatch.selectedItem = null;
                return
            }
            if (Netwatch.selected != null) { Netwatch.selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            Netwatch.selected = $($row);
            Netwatch.selectedItem = arg.item;
            // Netwatch.editBtn.removeClass("d-none");
        },
        fields: [
            // { type: 'control', width: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'fields.ip', type: 'text', width: 150, headerTemplate: 'IP' },
            { name: 'fields.up', type: 'checkbox', width: 100, headerTemplate: 'UP' },
        ],
        controller: {
            loadData: (filter) => {
                return $.grep(Netwatch.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.ip || data.fields.ip.indexOf(filter.fields.ip) > -1)
                        && (filter.fields.up === undefined || data.fields.up === filter.fields.up)
                });
            }
        },
    };
    Netwatch.init();
}