(function(){
	var oContainer = document.getElementById("container");
	var oPrev = document.getElementById("prev");
	var oNext = document.getElementById("next");
	var COL = 6,
		ROW = 4,
		NUM = COL * ROW,
		index = 0,
		loaded = 0,
		THUMB_IMG_WIDTH = THUMB_IMG_HEIGHT = 125,
		BIG_IMG_WIDTH = 750,
		BIG_IMG_HEIGHT = 500,
		bFold = false,
		bigImageLeft = (oContainer.offsetWidth - BIG_IMG_WIDTH)/2,
		bigImageTop = (oContainer.offsetHeight - BIG_IMG_HEIGHT)/2,
		iColGap = (oContainer.offsetWidth - COL*THUMB_IMG_WIDTH)/(COL+1),
		iRowGap = (oContainer.offsetHeight - ROW*THUMB_IMG_HEIGHT)/(ROW+1);
	for(var i=0; i<NUM; i++){
		var oBigImg = new Image();
		oBigImg.src = "img/"+(i+1)+".jpg";
		oBigImg.onload = function(){
			loaded++;
			if(loaded == NUM*2){
				loadSuccess();
			}
		};
		var oThumbImg = new Image();
		oThumbImg.src = "img/thumbs/"+(i+1)+".jpg";
		oThumbImg.onload = function(){
			loaded++;
			if(loaded == NUM*2){
				loadSuccess();
			}
		};
	}
	function loadSuccess(){

		for(var i=0; i<ROW; i++){
			for(var j=0; j<COL; j++){
				index++;

				var oDiv = document.createElement("div");
				oDiv.index = index;
				oDiv.matrix = {
					col: j,
					row: i
				};
				oDiv.style.width = THUMB_IMG_WIDTH + "px";
				oDiv.style.height = THUMB_IMG_HEIGHT + "px";
				oDiv.className = "img";
				oDiv.style.background = "url(img/thumbs/"+index+".jpg)";
				oDiv.style.left = -(THUMB_IMG_WIDTH+100) + "px";
				oDiv.style.top = -(THUMB_IMG_HEIGHT+100) + "px";
				oDiv.unfoldPos = {
					left: iColGap + j*(iColGap+THUMB_IMG_WIDTH),
					top: iRowGap + i*(iRowGap+THUMB_IMG_HEIGHT)
				};
				oDiv.foldPos = {
					left: bigImageLeft + j*THUMB_IMG_WIDTH,
					top: bigImageTop + i*THUMB_IMG_HEIGHT
				};
				oDiv.innerHTML = "<span></span>"
				oContainer.appendChild(oDiv);
			}
		}
		var aImg = document.getElementsByClassName("img");
		var timer = setInterval(function(){
			index--;
			if(index == 0)
				clearInterval(timer);
			aImg[index].style.left = aImg[index].unfoldPos.left + "px";
			aImg[index].style.top = aImg[index].unfoldPos.top + "px";
			setStyle3d(aImg[index], 'transform', "rotate("+(Math.random()*40-20)+"deg)");
			// aImg[index].style.WebkitTransform = "rotate("+(Math.random()*40-20)+"deg)";
			aImg[index].addEventListener("click", clickHandler, false);
		}, 80);
		function clickHandler(){
			if(bFold){ //unfold
				for(var i=0; i<aImg.length; i++){
					aImg[i].style.left = aImg[i].unfoldPos.left + "px";
					aImg[i].style.top = aImg[i].unfoldPos.top + "px";
					aImg[i].className = "img";
					setStyle3d(aImg[i], 'transform', "rotate("+(Math.random()*40-20)+"deg)");
					var oSpan = aImg[i].getElementsByTagName("span")[0];
					oSpan.style.opacity = 0;
				}
				oNext.style.display = 'none';
				oPrev.style.display = 'none';
			}else{ //fold
				for(var i=0; i<aImg.length; i++){
					aImg[i].style.left = aImg[i].foldPos.left + "px";
					aImg[i].style.top = aImg[i].foldPos.top + "px";
					aImg[i].className = "img piece";
					setStyle3d(aImg[i], "transform", "rotate(0deg)");
					var oSpan = aImg[i].getElementsByTagName("span")[0];
					oSpan.style.background = "url(img/"+this.index+".jpg)"+(-aImg[i].matrix.col*THUMB_IMG_WIDTH)+"px "+(-aImg[i].matrix.row*THUMB_IMG_HEIGHT)+"px";
					oSpan.style.opacity = 1;
				}
				oNext.style.display = 'block';
				oPrev.style.display = 'block';
				var iNow = this.index;
				oNext.onclick = oPrev.onclick = function(e){
					if(this == oPrev){
						iNow--;
						if(iNow == 0){
							iNow = NUM;
						}
					}else{
						if(iNow == NUM){
							iNow = 0;
						}
						iNow++;
					}
					var index2 = 0;
					var timer = setInterval(function(){
						if(index2 == NUM-1){
							clearInterval(timer);
						}
						var oSpan = aImg[index2].getElementsByTagName("span")[0];
						oSpan.style.background = "url(img/"+iNow+".jpg)"+(-aImg[index2].matrix.col*THUMB_IMG_WIDTH)+"px "+(-aImg[index2].matrix.row*THUMB_IMG_HEIGHT)+"px";
						index2++;
					}, 50);
				}
			} 
			bFold = !bFold;
		}
	}
	function setStyle3d(elem, attr, value){
		['Webkit', 'Moz', 'Ms', 'O', ''].forEach(function(prefix){
			elem.style[prefix+attr.charAt(0).toUpperCase()+attr.substr(1)] = value;
		})
	}
})();
