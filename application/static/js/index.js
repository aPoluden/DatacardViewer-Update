/*
 * allchekced - holds an array of selected values of checkboxes
 */
var allchekced = [];
$(function() {
    $("#tabs").tabs();
    $("#tabs li").click(function() {
	    $('li').removeClass('active');
	    $(this).addClass("active");
	});
});

/*
 * Controlling dropdown menu and checkeboxes
 */
$(function() {  
     $('button#test').on('click', function(e) {
        Histogram.start();

     });
     
     $('input#checkAll').on("click", function(e) {
       $('input:checkbox').not(this).prop('checked', this.checked);
       allchekced = $("input:checkbox:checked").map(function(){
                return $(this).val();
       }).toArray();
       allchekced.splice(0, 1);   
     });

     $(document).on('change', '.dinamyc#check', function() {
         if (allchekced.indexOf($(this).val()) === -1) {
	   allchekced.push($(this).val());
	 } else {
	   var i = allchekced.indexOf($(this).val());
	   allchekced.splice(i, 1);
	 }
     });

    $('.dropdown-menu').on('click', function(e) {
        if($(this).hasClass('dropdown-menu-form')) {
            e.stopPropagation();
        }
    });
});

$(document).on("click", function (e) {
    reloadCheckBox();
    var $popover = $("button.fa-bars").popover({
        selector: '[data-original-title=]'
    });
    var $target = $(e.target),
        isPopover = $(e.target).is('[data-original-title=]'),
        inPopover = $(e.target).closest('.popover').length > 0
	
    //hide only if clicked on button or inside popover
    if (!isPopover && !inPopover)
    	$popover.popover('hide');
});
/*
 * Controlling BoostrapDialog with MASS parameter 
 */
$(BootstrapDialog).on('click',function() {
       $('input:text').on('keyup', function() {
          // var id = $(this).attr('id');
	  //add id parameter change bottom line to > $('span.artiom#' + id).text($(this).val());
          if ($.isNumeric($(this).val())) {
	    ($('span.artiom').text($(this).val())).css('color', 'LawnGreen');
	  } else {
	    ($('span.artiom').text($(this).val())).css('color', 'red');
            //e.stopPropagation();
	  }
    });
});

function reloadCheckBox() {
   $('.dropdown-menu').parent().removeClass('open');
   $('input:checkbox').attr('checked', false);
   allchekced = [];
}
