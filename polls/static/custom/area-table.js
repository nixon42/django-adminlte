function areaContent() {
    var content = $('#area-content');
    var Area = new TableObjTemplate();
    Area.name = 'Area';
    Area.jsgrid = content.find('#area-table-jsgrid');
    Area._content = content.find('#area-table');
    Area.modalSel = content.find('.area-modal');
    Area.dataUrl = '/getarea';
    Area.insertUrl = '/addarea';
    Area.globalVarUpdateCB = (data) => {
        AREA = [];
        AREA.push({ pk: 0, name: '' });
        // console.log(data);
        $('.input-area').empty();
        $('.input-area').append('<option value="0"></option>');
        $.each(Area.data, (key, val) => {
            AREA.push({ pk: val.pk, name: val.fields.name, code: val.fields.code });
            $('.input-area').append(`<option value="${val.pk}">${val.fields.code}</option>`);
        });
    };
    Area.modalInput = {
        name: '.input-name',
        code: '.input-area-code'
    };
    Area.jsgridConfig = {
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
            let $row = Area.jsgrid.find('.jsgrid-selected-row');
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                Area.editBtn.addClass("d-none");
                Area.selected = null;
                Area.selectedItem = null;
                return
            }
            if (Area.selected != null) { Area.selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            Area.selected = $($row);
            Area.selectedItem = arg.item;
            Area.editBtn.removeClass("d-none");
        },
        fields: [
            // { type: 'control', width: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'fields.name', type: 'text', width: 150, headerTemplate: 'Name' },
            { name: 'fields.code', type: 'text', width: 100, headerTemplate: 'Area Code' },
        ],
        controller: {
            loadData: (filter) => {
                return $.grep(Area.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.name || data.fields.name.toLowerCase().indexOf(filter.fields.name.toLowerCase()) > -1)
                        && (!filter.fields.code || data.fields.code.toLowerCase().indexOf(filter.fields.code.toLowerCase()) > -1)
                });
            }
        },
    };
    Area.init();
    CONTENT_INIT.table.area = Area;
}