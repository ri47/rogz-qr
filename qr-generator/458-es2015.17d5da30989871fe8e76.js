(self.webpackChunkqr_generator=self.webpackChunkqr_generator||[]).push([[458],{42458:function(e,t,n){"use strict";n.r(t),n.d(t,{RedirectQRModule:function(){return L}});var r=n(61116),a=n(63337),o=n(97892),i=n(31041),s=n(35366),d=n(92935),l=n(93957),c=n(63589),m=n(87672),p=n(22797),h=n(13070),g=n(9550),u=n(31419),f=n(35965),v=n(84369);function x(e,t){1&e&&s["\u0275\u0275element"](0,"mat-progress-spinner",4)}function C(e,t){1&e&&(s["\u0275\u0275elementStart"](0,"mat-error"),s["\u0275\u0275text"](1," This field is required. "),s["\u0275\u0275elementEnd"]())}function w(e,t){if(1&e&&(s["\u0275\u0275elementStart"](0,"mat-error"),s["\u0275\u0275text"](1),s["\u0275\u0275elementEnd"]()),2&e){const e=s["\u0275\u0275nextContext"](2);s["\u0275\u0275advance"](1),s["\u0275\u0275textInterpolate1"](" ",e.getErrorPassword()," ")}}function I(e,t){if(1&e){const e=s["\u0275\u0275getCurrentView"]();s["\u0275\u0275elementStart"](0,"mat-card"),s["\u0275\u0275elementStart"](1,"mat-card-content"),s["\u0275\u0275elementStart"](2,"form",5),s["\u0275\u0275listener"]("ngSubmit",function(){return s["\u0275\u0275restoreView"](e),s["\u0275\u0275nextContext"]().onSubmit()}),s["\u0275\u0275elementStart"](3,"div",6),s["\u0275\u0275elementStart"](4,"mat-form-field"),s["\u0275\u0275element"](5,"input",7),s["\u0275\u0275template"](6,C,2,0,"mat-error",3),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementStart"](7,"div",6),s["\u0275\u0275elementStart"](8,"mat-form-field"),s["\u0275\u0275element"](9,"input",8),s["\u0275\u0275template"](10,w,2,1,"mat-error",3),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"](),s["\u0275\u0275element"](11,"br"),s["\u0275\u0275elementStart"](12,"div",9),s["\u0275\u0275elementStart"](13,"div",10),s["\u0275\u0275elementStart"](14,"button",11),s["\u0275\u0275listener"]("click",function(){return s["\u0275\u0275restoreView"](e),s["\u0275\u0275nextContext"]().goToRegister()}),s["\u0275\u0275text"](15,"Create New Account"),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementStart"](16,"div",12),s["\u0275\u0275elementStart"](17,"button",13),s["\u0275\u0275text"](18,"Login"),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"]()}if(2&e){const e=s["\u0275\u0275nextContext"]();s["\u0275\u0275advance"](2),s["\u0275\u0275property"]("formGroup",e.formGroup),s["\u0275\u0275advance"](4),s["\u0275\u0275property"]("ngIf",!e.formGroup.controls.userName.valid&&e.formGroup.controls.userName.touched),s["\u0275\u0275advance"](4),s["\u0275\u0275property"]("ngIf",!e.formGroup.controls.password.valid&&e.formGroup.controls.password.touched),s["\u0275\u0275advance"](7),s["\u0275\u0275property"]("disabled",!e.formGroup.valid)}}let y=(()=>{class e{constructor(e,t,n,r,a){this.dialogRef=e,this.formBuilder=t,this.router=n,this.service=r,this.snackBar=a,this.environment=o.N,this.loading=!1}ngOnInit(){this.createForm()}createForm(){this.formGroup=this.formBuilder.group({userName:new i.NI(null,i.kI.required),password:new i.NI(null,[i.kI.required,this.checkPassword])})}checkPassword(e){const t=e.value;return!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(t)&&t?{requirements:!0}:null}getErrorPassword(){return this.formGroup.get("password").hasError("required")?"This field is required":this.formGroup.get("password").hasError("requirements")?"Password needs to be at least eight characters, one uppercase letter and one number":""}goToRegister(){this.router.navigate(["/auth/register"]),this.dialogRef.close()}onSubmit(){if(this.formGroup.valid&&!this.loading){this.loading=!0;const e={userName:this.formGroup.controls.userName.value,password:this.environment.encryptString(this.formGroup.controls.password.value)};this.service.makeAPICall(this.service.postMethod,this.service.loginAPI,e,e=>{this.loading=!1,0!==e.code?200===e.code?(localStorage.setItem("authToken",e.authToken),localStorage.setItem("userInfo",JSON.stringify(e.data)),this.dialogRef.close()):o.N.flash(this.snackBar,e.message):o.N.flash(this.snackBar,"Something went wrong!")})}}}return e.\u0275fac=function(t){return new(t||e)(s["\u0275\u0275directiveInject"](d.so),s["\u0275\u0275directiveInject"](i.qu),s["\u0275\u0275directiveInject"](a.F0),s["\u0275\u0275directiveInject"](l.t),s["\u0275\u0275directiveInject"](c.ux))},e.\u0275cmp=s["\u0275\u0275defineComponent"]({type:e,selectors:[["app-login-modal"]],decls:7,vars:2,consts:[["mat-dialog-title",""],["mat-dialog-content","",1,"flex-box"],["style","margin: 0 auto;top: 50%;","color","primary","mode","indeterminate",4,"ngIf"],[4,"ngIf"],["color","primary","mode","indeterminate",2,"margin","0 auto","top","50%"],[1,"form",3,"formGroup","ngSubmit"],[1,"form-element"],["matInput","","placeholder","Username","formControlName","userName"],["matInput","","type","password","placeholder","Password","formControlName","password"],["gdAreas","side content","gdRows","auto"],["gdArea","side","fxLayoutAlign","flex-start"],["type","button","mat-raised-button","","color","primary",3,"click"],["gdArea","content","fxLayoutAlign","flex-end"],["type","submit","mat-raised-button","","color","primary",3,"disabled"]],template:function(e,t){1&e&&(s["\u0275\u0275elementStart"](0,"div"),s["\u0275\u0275elementStart"](1,"span"),s["\u0275\u0275elementStart"](2,"h4",0),s["\u0275\u0275text"](3,"Please login to view QR code details"),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementStart"](4,"div",1),s["\u0275\u0275template"](5,x,1,0,"mat-progress-spinner",2),s["\u0275\u0275template"](6,I,19,4,"mat-card",3),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"]()),2&e&&(s["\u0275\u0275advance"](5),s["\u0275\u0275property"]("ngIf",t.loading),s["\u0275\u0275advance"](1),s["\u0275\u0275property"]("ngIf",!t.loading))},directives:[d.uh,d.xY,r.O5,m.Ou,p.a8,p.dn,i._Y,i.JL,i.sg,h.KE,g.Nt,i.Fj,i.JJ,i.u,u.kY,u.Q,u.xi,f.Wh,v.lW,h.TO],styles:[".form-element[_ngcontent-%COMP%]{margin:5px 0 10px}.label-field[_ngcontent-%COMP%]{color:#757575;font-size:18px}.fileUpload[_ngcontent-%COMP%]{border:2px dashed;width:100px;height:100px;color:#1e88e5;padding:0}.cam-upload[_ngcontent-%COMP%]{font-size:80px;height:auto;width:auto}.image-preview[_ngcontent-%COMP%]{margin-top:10px}.flex-box[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap}.full[_ngcontent-%COMP%]{width:100%}.half[_ngcontent-%COMP%]{width:50%}.three[_ngcontent-%COMP%]{width:33.33%}.form-element[_ngcontent-%COMP%]{padding:0 5px;box-sizing:border-box}.form-element[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-weight:400;font-size:16px}.form-element[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], .form-element[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{color:rgba(0,0,0,.54)}.container[_ngcontent-%COMP%]{display:flex;justify-content:center;margin:10% 0}  .mat-form-field{width:100%;min-width:300px}mat-card-content[_ngcontent-%COMP%], mat-card-title[_ngcontent-%COMP%]{display:flex;justify-content:center}.error[_ngcontent-%COMP%]{padding:10px;width:300px;color:#fff;background-color:red}mat-card.mat-card[_ngcontent-%COMP%]{max-width:500px;width:100%;box-shadow:none;border:1px solid #ccc}form.form[_ngcontent-%COMP%]{width:100%}.bg[_ngcontent-%COMP%]{display:flex;background:#dedede;height:calc(100vh - 65px)}.bg[_ngcontent-%COMP%], .bg[_ngcontent-%COMP%]   mat-card.mat-card.ng-star-inserted[_ngcontent-%COMP%]{margin:auto}.bg[_ngcontent-%COMP%]   mat-card-title[_ngcontent-%COMP%]{font-weight:700}"]}),e})();function b(e,t){1&e&&(s["\u0275\u0275elementStart"](0,"div",2),s["\u0275\u0275element"](1,"mat-progress-spinner",3),s["\u0275\u0275elementEnd"]())}function S(e,t){if(1&e&&(s["\u0275\u0275elementStart"](0,"div"),s["\u0275\u0275elementStart"](1,"p"),s["\u0275\u0275text"](2),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"]()),2&e){const e=s["\u0275\u0275nextContext"](2);s["\u0275\u0275advance"](2),s["\u0275\u0275textInterpolate"](e.qrText)}}function k(e,t){if(1&e&&(s["\u0275\u0275elementStart"](0,"p"),s["\u0275\u0275text"](1),s["\u0275\u0275elementEnd"]()),2&e){const e=s["\u0275\u0275nextContext"](3);s["\u0275\u0275advance"](1),s["\u0275\u0275textInterpolate1"]("First Name: ",e.qrContact.firstName,"")}}function E(e,t){if(1&e&&(s["\u0275\u0275elementStart"](0,"p"),s["\u0275\u0275text"](1),s["\u0275\u0275elementEnd"]()),2&e){const e=s["\u0275\u0275nextContext"](3);s["\u0275\u0275advance"](1),s["\u0275\u0275textInterpolate1"]("Last Name: ",e.qrContact.lastName,"")}}function P(e,t){if(1&e&&(s["\u0275\u0275elementStart"](0,"a",8),s["\u0275\u0275text"](1),s["\u0275\u0275elementEnd"]()),2&e){const e=s["\u0275\u0275nextContext"](3);s["\u0275\u0275propertyInterpolate1"]("href","tel:",e.qrContact.tel,"",s["\u0275\u0275sanitizeUrl"]),s["\u0275\u0275advance"](1),s["\u0275\u0275textInterpolate"](e.qrContact.tel)}}function O(e,t){if(1&e&&(s["\u0275\u0275elementStart"](0,"p"),s["\u0275\u0275text"](1,"Email: "),s["\u0275\u0275elementStart"](2,"a",8),s["\u0275\u0275text"](3),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"]()),2&e){const e=s["\u0275\u0275nextContext"](3);s["\u0275\u0275advance"](2),s["\u0275\u0275propertyInterpolate1"]("href","mailto:",e.qrContact.email,"",s["\u0275\u0275sanitizeUrl"]),s["\u0275\u0275advance"](1),s["\u0275\u0275textInterpolate"](e.qrContact.email)}}function M(e,t){if(1&e&&(s["\u0275\u0275elementStart"](0,"div"),s["\u0275\u0275template"](1,k,2,1,"p",1),s["\u0275\u0275template"](2,E,2,1,"p",1),s["\u0275\u0275elementStart"](3,"p"),s["\u0275\u0275text"](4,"Phone: "),s["\u0275\u0275template"](5,P,2,2,"a",7),s["\u0275\u0275elementEnd"](),s["\u0275\u0275template"](6,O,4,2,"p",1),s["\u0275\u0275elementEnd"]()),2&e){const e=s["\u0275\u0275nextContext"](2);s["\u0275\u0275advance"](1),s["\u0275\u0275property"]("ngIf",null!==e.qrContact.firstName),s["\u0275\u0275advance"](1),s["\u0275\u0275property"]("ngIf",null!==e.qrContact.lastName),s["\u0275\u0275advance"](3),s["\u0275\u0275property"]("ngIf",null!==e.qrContact.tel),s["\u0275\u0275advance"](1),s["\u0275\u0275property"]("ngIf",null!==e.qrContact.email)}}function q(e,t){1&e&&(s["\u0275\u0275elementStart"](0,"div"),s["\u0275\u0275elementStart"](1,"p"),s["\u0275\u0275text"](2,"Your QR-Code Decoded sucessfully.."),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"]())}function _(e,t){if(1&e&&(s["\u0275\u0275elementStart"](0,"mat-card"),s["\u0275\u0275elementStart"](1,"span",4),s["\u0275\u0275template"](2,S,3,1,"div",5),s["\u0275\u0275template"](3,M,7,4,"div",5),s["\u0275\u0275template"](4,q,3,0,"div",6),s["\u0275\u0275elementEnd"](),s["\u0275\u0275elementEnd"]()),2&e){const e=s["\u0275\u0275nextContext"]();s["\u0275\u0275advance"](1),s["\u0275\u0275property"]("ngSwitch",e.qrType),s["\u0275\u0275advance"](1),s["\u0275\u0275property"]("ngSwitchCase","text"),s["\u0275\u0275advance"](1),s["\u0275\u0275property"]("ngSwitchCase","contact")}}const N=[{path:"qrURL/:id",component:(()=>{class e{constructor(e,t,n,r,a){this.router=e,this.activatedRoute=t,this.service=n,this.snackBar=r,this.dialog=a,this.isLoggedIn=!1,this.loading=!1,this.environment=o.N,this.url=this.activatedRoute.snapshot.params.id}ngOnInit(){this.url?this.getData():this.router.navigate([""])}openDialog(){this.dialog.open(y,{height:"auto",width:"500px",hasBackdrop:!1}).afterClosed().subscribe(e=>{this.isLoggedIn=!0,this.decodeQrCode()})}getData(){this.loading=!0,this.service.makeAPICall(this.service.postMethod,this.service.redirectURL,{qrID:this.url},e=>{200===e.code?(this.qrType=e.qrType,this.data=e.qrData,!this.service.getLocalStorage("authToken")&&(null==e?void 0:e.isPrivate)?this.openDialog():(this.isLoggedIn=!0,this.decodeQrCode()),this.loading=!1):(o.N.flash(this.snackBar,e.message),this.router.navigate([""]))})}decodeQrCode(){switch(this.qrType){case"url":this.openRedirectLink(this.data);break;case"tel":this.openRedirectLink(`tel:${this.data}`);break;case"email":this.openRedirectLink(`mailto:${this.data.email}?subject=${this.data.subject}&body=${this.data.body}`);break;case"contact":this.qrContact=this.data;break;case"location":this.openRedirectLink(`https://maps.google.com/?q=${this.data.lat},${this.data.lng}`);break;case"whatsapp":const e=encodeURIComponent(this.data.message);this.openRedirectLink(`https://api.whatsapp.com/send?phone=${this.data.phoneNumber}&text=${e}`);break;case"zoom":this.openRedirectLink(`https://zoom.us/j/${this.data.meetingCode}?pwd=${this.data.password}`);break;case"skype":this.openRedirectLink(`https://join.skype.com/invite/${this.data.inviteLink}`);break;default:this.qrText=this.data}}openRedirectLink(e){let t;t=document.createElement("a"),document.body.appendChild(t),t.style.display="none",t.href=e,t.click()}}return e.\u0275fac=function(t){return new(t||e)(s["\u0275\u0275directiveInject"](a.F0),s["\u0275\u0275directiveInject"](a.gz),s["\u0275\u0275directiveInject"](l.t),s["\u0275\u0275directiveInject"](c.ux),s["\u0275\u0275directiveInject"](d.uw))},e.\u0275cmp=s["\u0275\u0275defineComponent"]({type:e,selectors:[["app-redirect-qr"]],decls:2,vars:2,consts:[["class","loader-margin",4,"ngIf"],[4,"ngIf"],[1,"loader-margin"],["color","primary","mode","indeterminate","value","value",1,"loader"],[3,"ngSwitch"],[4,"ngSwitchCase"],[4,"ngSwitchDefault"],[3,"href",4,"ngIf"],[3,"href"]],template:function(e,t){1&e&&(s["\u0275\u0275template"](0,b,2,0,"div",0),s["\u0275\u0275template"](1,_,5,3,"mat-card",1)),2&e&&(s["\u0275\u0275property"]("ngIf",t.loading),s["\u0275\u0275advance"](1),s["\u0275\u0275property"]("ngIf",!t.loading&&t.isLoggedIn))},directives:[r.O5,m.Ou,p.a8,r.RF,r.n9,r.ED],styles:[""]}),e})()}];let R=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=s["\u0275\u0275defineNgModule"]({type:e}),e.\u0275inj=s["\u0275\u0275defineInjector"]({imports:[[a.Bz.forChild(N)],a.Bz]}),e})();var j=n(78764);let L=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=s["\u0275\u0275defineNgModule"]({type:e}),e.\u0275inj=s["\u0275\u0275defineInjector"]({imports:[[r.ez,R,j.m]]}),e})()}}]);