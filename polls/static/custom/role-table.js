function RoleTable() {
    var content = $('#role-table-content');
    var RoleTableobj = new TableObjTemplate();
    RoleTableobj.name = 'Role-Table';
    RoleTableobj.jsgrid = content.find('#role-table-jsgrid');
    RoleTableobj._content = content.find('#role-table');
    RoleTableobj.modalSel = content.find('.role-table-modal');
    RoleTableobj.dataUrl = API_URL.team.getRole;
    RoleTableobj.insertUrl = API_URL.team.addRole;
    RoleTableobj.parseData = false;

    RoleTableobj.globalVarUpdateCB = (data) => {
        // console.log(data);
        ROLE = data;
    };
    RoleTableobj.modalInput = {
        firstName: '.input-first-name',
        lastName: '.input-last-name',
        username: '.input-username',
        password: '.input-password',

    };
    RoleTableobj.jsgridConfig = {
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
            let $row = RoleTableobj.jsgrid.find('.jsgrid-selected-row');
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                RoleTableobj.editBtn.addClass("d-none");
                RoleTableobj.selected = null;
                RoleTableobj.selectedItem = null;
                return
            }
            if (RoleTableobj.selected != null) { RoleTableobj.selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            RoleTableobj.selected = $($row);
            RoleTableobj.selectedItem = arg.item;
            RoleTableobj.editBtn.removeClass("d-none");
        },
        fields: [
            // { type: 'control', width: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'fields.first_name', type: 'text', width: 150, headerTemplate: 'First Name' },
            { name: 'fields.last_name', type: 'text', width: 150, headerTemplate: 'Last Name' },
            { name: 'fields.username', type: 'text', width: 100, headerTemplate: 'Username' },
        ],
        controller: {
            loadData: (filter) => {
                return $.grep(RoleTableobj.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.first_name || data.fields.first_name.toLowerCase().indexOf(filter.fields.first_name.toLowerCase()) > -1)
                        && (!filter.fields.last_name || data.fields.last_name.toLowerCase().indexOf(filter.fields.last_name.toLowerCase()) > -1)
                        && (!filter.fields.username || data.fields.username.toLowerCase().indexOf(filter.fields.username.toLowerCase()) > -1)
                });
            }
        },
    };
    RoleTableobj.init();
}