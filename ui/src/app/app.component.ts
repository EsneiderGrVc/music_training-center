import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "ui";

  ngOnInit(): void {
    let lastTouchEnd = 0;

    document.addEventListener(
      "touchend",
      function (event) {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault(); // Prevents the double-tap zoom behavior
        }
        lastTouchEnd = now;
      },
      false
    );
  }
}
