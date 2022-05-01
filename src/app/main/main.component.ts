import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any> | undefined;
  message: string = "";
  username: string = "";
  password: string = "";
  object: object | any;

  constructor(private restService: RestService, private cdRef: ChangeDetectorRef) { }


  ngOnInit(): void {
}

printMsg(msg: string): void {
    this.message += `${msg}<br/>`;
    this.cdRef.detectChanges();
    if (this.scroll != undefined)
        this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
}

ngOnDestroy(): void {
}

incur(): void {
    this.restService.getGames().subscribe({
        next:   (res) =>
        {
            for(var attributename in res){
                console.log(attributename+": ");
                if (typeof res[attributename] == typeof [Object])
                for (var a in res[attributename])
                    console.log(`${a}: ${res[attributename][a]}`)
            }
        } ,
        error:  (err) => this.printMsg(`Request failed with error: ${err}`),
        complete: () => this.printMsg('complete') 
    });
    console.log("Hola")
    //this.message = "";
    //this.ipcService.send("get_credentials");
    //this.ipcService.send("button_click", ["incur", this.username, this.password]);
}

report(): void {
    
}

}
