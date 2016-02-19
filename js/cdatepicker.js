(function($,window,document){
    /*公共方法*/

    var CDatepicker=function(){

        var _=this,
            datetimes={year:"",month:"",day:""},
            datepickerdiv="";

        this.opts={
            monthNames:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],//显示的月份
            monthMini:["1","2","3","4","5","6","7","8","9","10","11","12"],
            yearLimit:30,//允许下拉选择的年限
            select:null//选择完月份的回调函数
        };
        this.init=function(el,opts){
            _.el=el;
            $.extend(_.opts,opts);
            _._createHtml();
            _._setDateTime();
            _._hidePicker();
            _.el.on("click keyup",function( ){
                console.log('a');
                var dateArr=_.el.val().split('-');
                if(dateArr.length>1){
                    datetimes.month=dateArr[1].length==1?("0"+dateArr[1]):dateArr[1];
                }
                if(dateArr.length>0){
                    datetimes.year= $.trim(dateArr[0]).length>0?dateArr[0]: _.elPicker.find('select').val();
                    datepickerdiv.find('.yee-selyear').val(datetimes.year);
                }
                _.elPicker.find("a").each(function(){
                    var curMonth=datetimes.month;
                    if(curMonth){
                    if(curMonth.indexOf("0")==0&&curMonth.length>0){
                        curMonth=curMonth.substr(1,curMonth.length-1);
                    }
                    if($(this).attr("data-month")==curMonth){

                        $(this).addClass("yee-state-highlight");
                    }else{
                        $(this).removeClass("yee-state-highlight");
                    }
                    }
                });
                datepickerdiv.find('.spMonth').html(datetimes.month);
                _._showPicker();
            });
            $(document).on('mouseup', function(e){
                e = window.event || e; // 兼容IE7
                var obj = $(e.srcElement || e.target);
                if ($(obj).is(".yee-datepicker,.yee-datepicker *")||$(obj).is(_.el)) {
                } else {
                    if(_.el && !_.el.is("hidden")&&!$(this).is("select")){
                        _._hidePicker();
                    }
                }

            }).on('keydown', function(event){
                event = event || window.event;
                var codes = event.keyCode;

                //如果在日期显示的时候按回车
                if(codes === 13 && _.el){
                    _._hidePicker();
                }
            });


            return _;
        };
        this._showPicker=function(){
            _.elPicker.show();
        };
        this._hidePicker=function(){
            _.elPicker.hide();
        };

        this._createHtml=function(){

              datepickerdiv=$('<div  id="yee-datepicker-div" class="yee-datepicker">');
            _.elPicker=datepickerdiv;
            datepickerdiv.css({
            left: _.el.offset().left+"px",
                top: _.el.offset().top+ _.el.height()+10+"px",
                position:"absolute"
            });

            var divObj=$('<div class="yee-date-container"></div>'),
                divTitleObj=$('<div class="yee-datepicker-title"></div>');

            var html="",selHtml="";

            selHtml+='<select class="yee-selyear">';//select years
            var date=new Date();
            for(var year=date.getFullYear();(date.getFullYear()-year)<_.opts.yearLimit;year--) {

                selHtml+='<option value="'+year+'">'+year+'</option>';//select years
            }

            var  curMonth= ($.trim(datetimes.month.toString()).length>0)?datetimes.month:parseInt(date.getMonth())+parseInt(1);
            if(curMonth.toString().length==1){
                curMonth="0"+curMonth;
            }
            selHtml+='</select> 年<span class="spMonth">'+curMonth+'</span>月';//select months

            divTitleObj.html(selHtml);
            divTitleObj.on("click",function(){

                _._showPicker();
            });
            html+='<table class="yee-datepicker-calendar">';
            //create months
            for(var i=0;i<4;i++){
                html+="<tr>";
                for(var j=0;j<3;j++){
                    var highlightClass="";

                    if(parseInt(datetimes.month)==(parseInt(i*3+j)+parseInt(1))){
                        highlightClass="yee-state-highlight";
                    }
                    html+='<td><a class="yee-state-default '+highlightClass+'" href="javascript:" data-month="'+(parseInt(i*3+j)+parseInt(1))+'">'+ _.opts.monthNames[i*3+j]+'</a></td>';
                }
                html+="</tr>";
            }

            html+="</table>";


            divObj.append(divTitleObj).append($(html));
            datepickerdiv.append(divObj);

            $("body").append(datepickerdiv);
            _.elPicker.find("a").on("click",function(e){
                e.stopPropagation();
                _._setMonth(this);
                _._select();
            });
        };
        this._setYear=function(){
            datetimes.year=_.elPicker.find(".yee-selyear").val();
            _.elPicker.find(".yee-selyear").on("change",function(){
                datetimes.year=_.elPicker.find(".yee-selyear").val();
                var date=datetimes.year+"-"+datetimes.month;
                if(datetimes.month&&$.trim(datetimes.month.toString().length>0))
                _.el.val(date);
            });
        };
        this._setMonth=function(obj){

            datetimes.month=obj? $(obj).attr("data-month"):_.elPicker.find(".yee-selmonth").val();
            if(datetimes.month){
                datetimes.month= datetimes.month.length==1?("0"+ datetimes.month.toString()): datetimes.month;

            }

        };
        this._setDateTime=function(){
            _._setYear();
            _._setMonth();

        };
        //选择月后执行的函数
        this._select=function(){

            var date=datetimes.year+"-"+datetimes.month;
            _._hidePicker();
            _.el.val(date);
            //执行回调
            if(_.opts.select){
                _.opts.select(date);
            }
        }
    };

    $.fn.cyeedatepicker=function(o){
        this.each(function( ){
            var me=$(this);
            (new CDatepicker).init(me,o);

        });

    };
})(jQuery,window,document);