void function(){
    var datas = {
        imgSrc: '',
        answers:[],
        level: 1
    };
    var vm =new Vue({
        el:'#app',
        data:datas
    });


    var $inBox = $('.J-inputBox');
    var $aBox =$('.J-aBox');
    var $tip = $('.J-rightTip');

    function changeImg(lv){
        $.ajax({
            url:'/change',
            dataType:'json',
            data:{
                lv: lv
            },
            success: function(data){
                datas.imgSrc = 'data:image/'+data.eName+';base64,'+data.newImg;
                datas.answers = data.answerBox;
                $inBox.html('');
                for (var i = 0 ; i< data.nameLength; i++){
                    $inBox.append('<span class="blank" data-index=""></span>')
                }
                if (data.isLast){
                    $tip.find('p').text('牛逼，恭喜通关');
                    $tip.find('button').hide();
                }
            },
            error: function(){
                console.log('error')
            }
        })
    }


    $aBox.on('click','button',function(e){
        var $blank = $inBox.find('.blank:first');
        if($blank.length > 0){
            var num = $(this).index();
            $blank.html($(this).text())
                .removeClass('blank')
                .attr('data-index',num);
            $(this).addClass('hide');
            if($inBox.find('.blank').length === 0){
                var name = $inBox.text().replace(/\s/g,'');
                $.ajax({
                    url:'/check',
                    data:{
                        name: name
                    },
                    success: function(data){
                        if (data.status){
                            $tip.show();
                        }else {
                            $inBox.find('span').addClass('wrong')
                        }
                    },
                    error: function(){
                        console.log('error')
                    }
                })
            }
        }
    });

    $inBox.on('click','span',function(){
        var $this = $(this);
        var ind = $this.attr('data-index');
        if($this.html() !==''&& ind!== ''){
            $tip.hide();
            $inBox.find('span').removeClass('wrong');
            $aBox.find('button').eq(ind).removeClass('hide');
            $this.text('').addClass('blank').attr('data-index','');
        }
    });

    $('.J-fresh').click(function(){
        $aBox.find('button').removeClass('hide');
        datas.level ++;
        window.localStorage.crazylv = datas.level;
        changeImg(parseInt(datas.level));
        $tip.hide();
    });


    function init(){
        var local = window.localStorage.crazylv;
        if (local){
            changeImg(local);
            datas.level = local;
        }else {
            window.localStorage.crazylv = 1;
            changeImg(1);
        }
    }

    init();
    //window.localStorage.

}();