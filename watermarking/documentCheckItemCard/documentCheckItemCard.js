import { LightningElement,api,track, wire } from 'lwc';
import altImage from '@salesforce/resourceUrl/fileAltImage';
import getImage from '@salesforce/apex/DocumentCheckItemProvider.getImageBase64Test'; //Added by Amol for Watermark
import saveWaterMarkImage from '@salesforce/apex/DocumentCheckItemProvider.saveWaterMarkImageBase64'; //Added by Amol for Watermark
import { NavigationMixin } from 'lightning/navigation';
//import updateFilesMainCase from '@salesforce/apex/Geotag.updateFilesMainCase';

export default class DocumentCheckItemCard extends NavigationMixin(LightningElement) {
    @api doc;
    @api isPortalUser;
    @api isIframe;
    altImagePic = altImage;
    @api recordId;
    @api iFrameData;
    @track box = ''; 
    @api imgTitle;
    connectedCallback(){
        this.iFrameData="/sfc/servlet.shepherd/document/download/"+this.doc.contentDocumentId+"#toolbar=0";
    }
    /*get iframe(){
        return this.iFrameData="/servlet/servlet.FileDownload?file="+this.doc.contentDocumentId;
        //console.log(iframe());*/

    
    filePreview(event) {
        // Naviagation Service to the show preview
        console.log(this.isPortalUser);
       if(this.isPortalUser){
           var apurl = 'https://'+location.host+
         '/'+'/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId='+
         event.currentTarget.dataset.id; 
        console.log(apurl);
        // Naviagation Service to the show preview
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: apurl
            }
          },true);
          
       }else{
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'filePreview'
            },
            state : {
                // assigning ContentDocumentId to show the preview of file
                selectedRecordId:event.currentTarget.dataset.id
            }
          });
       }         
    }
    fileDownload(event){
        var apurl = 'https://'+location.host+'/'+event.currentTarget.dataset.id;
        console.log(apurl);
        // Naviagation Service to the show preview
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: apurl
            }
          },false);
    }

    rotateFile(event){       
        let rotateAngle = 90;
       //this.box = 'transform: rotate(90deg)';
       //let index = event.currentTarget.dataset.rowIndex;
       let flipElement = this.template.querySelector('img');
       let getAngle = flipElement.getAttribute('style');
       if(getAngle.includes(90)){
           flipElement.setAttribute("style", "transform: rotate(180deg);height:200px; width: 300px; cursor:pointer;");
       } else if(getAngle.includes(180)){
           flipElement.setAttribute("style", "transform: rotate(270deg);height:200px; width: 300px; cursor:pointer;");
       } else if(getAngle.includes(270)){
           flipElement.setAttribute("style", "transform: rotate(360deg);height:200px; width: 300px; cursor:pointer;");
       } else if(getAngle.includes(360)){
           flipElement.setAttribute("style", "transform: rotate(90deg);height:200px; width: 300px; cursor:pointer;");
       } else {
           flipElement.setAttribute("style", "transform: rotate(" + rotateAngle + "deg);height:200px; width: 300px; cursor:pointer;");
       }
       //rotateAngle = rotateAngle + 90;
   }
   zoominFile(){        
        let img = this.template.querySelector('img');        
        let currHeight = img.clientHeight;
        let currWidth = img.clientWidth;
        //if (currWidth >= 450) return false;
        //else {
            img.style.width = (currWidth + 50) + "px";
            img.style.height = (currHeight + 50) + "px";
        //}
        
        //img.setAttribute("style", "transform: scale(2,2);height:200px; width: 300px; cursor:pointer;");
    }

    zoomoutFile(){
        let img = this.template.querySelector('img');
        let currHeight = img.clientHeight;
        let currWidth = img.clientWidth;
        if (currWidth <= 350) return false;
        else {
            img.style.width = (currWidth - 50) + "px";
            img.style.height = (currHeight - 50) + "px";
        }
    }
    resetFile(){
        let img = this.template.querySelector('img');
        img.style.width = 350 + "px";
        img.style.height = 200 + "px";

    }
  /*  @wire(updateFilesMainCase) title;
    updateFilesMainCase({data, error}) {
        if(title.data){
            console.log('data: updateFilesMainCase' +title.data);
           
           
        }else{
            console.log('error: '+error);
            this.isError = true;
            //console.log('error: '+error.body.message);
        }

    }*/
    //Added by Amol Tandon for Watermarking
    watermark(){
        console.log("hello in watermark");
        var canvas= this.template.querySelector("canvas");
        var watermarkcomp = this.template.querySelector('.watermark');
        var ctx=canvas.getContext("2d");
        var cw=canvas.width;
        var ch=canvas.height;
        
        var img=new Image();
        //img.crossOrigin='anonymous';
        img.onload=start;
        //img.src="https://www.filmibeat.com/ph-big/2021/05/kareena-kapoor_16214083044.jpg";
        //img.src= "https://yesbank6--dev.my.salesforce.com/sfc/servlet.shepherd/document/download/"+this.doc.contentDocumentId
        //img.src = "https://yesbank6--dev.my.salesforce.com/sfc/p/710000000SCP/a/710000000bAr/Xo83ibGZ.GM_J6VCu6WXloBgkkcfgVCtBgLvAT00K8I";
        img.src = this.doc.fileUrl;
        console.log("Image URL" + img.src);
        function start(){
            canvas.width=img.width;
            canvas.height=img.height;
            ctx.drawImage(img,0,0);
            console.log("In Start");
            //var updatedFile = canvas.toDataURL('image/jpeg', 1.0);
            //console.log(updatedFile);
        
        /*
        var img1 = this.template.querySelector("img");
        console.log("Im1" + img1);
        canvas.width=img1.width;
        canvas.height=img1.height;
        ctx.drawImage(img1,0,0);
        console.log("Image drawn");
        */

        
        
        var text = "Screened";
        var tempCanvas=document.createElement('canvas');
        console.log("canvas created");
        var tempCtx=tempCanvas.getContext('2d');
        var cw,ch;
        cw=tempCanvas.width=canvas.width;
        ch=tempCanvas.height=canvas.height;
        tempCtx.drawImage(canvas,0,0);
        console.log("temp image created");
        tempCtx.font="48px verdana";
        var textWidth=tempCtx.measureText(text).width;
        console.log("watermark with marked");
        tempCtx.globalAlpha=.50;
        tempCtx.fillStyle='white'
        tempCtx.fillText(text,cw-textWidth-10,ch-20);
        console.log("watermark filled");
        tempCtx.fillStyle='black'
        tempCtx.fillText(text,cw-textWidth-10+2,ch-(ch/2));
        console.log("watermark text filled");
        // just testing by adding tempCanvas to document
        //document.body.appendChild(tempCanvas);
        console.log("before plotting");
        //var watermarkcomp = this.template.querySelector('.watermark');
        console.log("watermarkcomp : " + watermarkcomp);
        watermarkcomp.appendChild(tempCanvas);
        
        console.log("after plotting");
        console.log("getting base64" + canvas + tempCanvas);
        var updatedFile1 = tempCanvas.toDataURL('image/jpeg', 1.0);
        //var updatedFile1 = tempCanvas.toDataURL("image/jpeg");
        //var updatedFile1 = tempCanvas.toDataURL("image/jpeg").split(';base64,')[1];
       //var updatedFile1 = tempCanvas.getCanvasImage();
        console.log(updatedFile1.toString());

        console.log("got base64");
    
    }
}

watermark1()
{   
    console.log("hello in watermark");
    var canvas= this.template.querySelector("canvas");
    var watermarkcomp = this.template.querySelector('.watermark');
    var contentId = this.doc.contentDocumentId;
    var ctx=canvas.getContext("2d");
    var cw=canvas.width;
    var ch=canvas.height;

    getImage({ versionId: this.doc.contentVersionId})
            .then(result => {
            console.log('result - ' + result);
            //this.files = JSON.parse(result);
            var img=new Image();
            img.onload=start;
            img.src = result;
            
            console.log('Image drawn');
            function start ()
            {
                canvas.width=img.width;
                canvas.height=img.height;
                ctx.drawImage(img,0,0);


                var text = "Screened";
                var tempCanvas=document.createElement('canvas');
                console.log("canvas created");
                var tempCtx=tempCanvas.getContext('2d');
                var cw,ch;
                /*
                cw=tempCanvas.width=canvas.width;
                ch=tempCanvas.height=canvas.height;
                tempCtx.drawImage(canvas,0,0);
                console.log("temp image created");
                tempCtx.font="72px Comic Sans MS";
                var textWidth=tempCtx.measureText(text).width;
                console.log("watermark with marked");
                tempCtx.globalAlpha=.50;
                //tempCtx.rotate( (Math.PI / 180) * -45);
                tempCtx.fillStyle='red'
                //tempCtx.fillText(text,cw-textWidth-10,ch-20);
                tempCtx.fillText(text,-width*2,72);
                 */
                cw=tempCanvas.width=canvas.width;
                ch=tempCanvas.height=canvas.height;
                tempCtx.drawImage(canvas,0,0);
                tempCtx.globalAlpha=0.5;
                // setup text for filling
                tempCtx.font = "72px Comic Sans MS" ;
                tempCtx.fillStyle = "red";
                // get the metrics with font settings
                var metrics = tempCtx.measureText(text);
                var width = metrics.width;
                // height is font size
                var height = 72;

                // change the origin coordinate to the middle of the context
                tempCtx.translate(canvas.width/2, canvas.height/2);
                // rotate the context (so it's rotated around its center)
                tempCtx.rotate(-Math.atan(canvas.height/canvas.width));
                // as the origin is now at the center, just need to center the text
                tempCtx.fillText(text,-width/2,height/2);

                
                
                console.log("before plotting");
                
                console.log("watermarkcomp : " + watermarkcomp);
                watermarkcomp.appendChild(tempCanvas);
                
                console.log("after plotting");
                console.log("getting base64" + canvas + tempCanvas);
                var updatedFile1 = tempCanvas.toDataURL('image/png', 1.0);
                //var updatedFile1 = tempCanvas.toDataURL("image/jpeg");
                //var updatedFile1 = tempCanvas.toDataURL("image/jpeg").split(';base64,')[1];
                //var updatedFile1 = tempCanvas.getCanvasImage();
                console.log(updatedFile1.toString());

                console.log("got base64");
                saveWaterMarkImage({contentDocId: contentId , saveWaterMarkImageBase64: updatedFile1.split(',')[1] })
                .then(result => { 
                    console.log(result);

                }) 
                console.log("Promise sent"); 


            }

    })
}
//End of Watermarking Code
    
}