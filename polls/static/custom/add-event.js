// ap table tool
// edit btn
$DOM.on('click', ".ap-table-tool-btn-edit", function () {
    console.log('ap table edit clicked');
    accessPointModal.show($("#content #ap-table-jsgrid").jsGrid('getSelected'));
    // console.log($("#content #ap-table-jsgrid").jsGrid('getSelected'));
});
// add btn
$DOM.on("click", ".ap-table-tool-btn-add", function () {
    console.log('aptable add clicked');
    accessPointModal.new();
    // apTableModal.modal();
});
// refresh btn
$DOM.on("click", ".ap-table-tool-btn-refresh", function () {
    console.log('ap table refresh clicked');
    $("#content #ap-table-jsgrid").jsGrid('refreshData');
    // $("#content #ap-table-jsgrid").jsGrid('loadData');
});

// ap-table modal
$DOM.on('click', '.ap-table-modal-save', function () {
    accessPointModal.save();
    $("#content #ap-table-jsgrid").jsGrid('loadData');
});

$DOM.on('click', '.ap-table-modal-clone', function () {
    accessPointModal.save('clone');
    $("#content #ap-table-jsgrid").jsGrid('loadData');
});


