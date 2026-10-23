(function () {
        "use strict";
        var $ = function (x) {
            return document.getElementById(x);
          },
          mode = "focus",
          running = false,
          end = 0,
          left = 25 * 60,
          timer,
          sessions = Number(localStorage.getItem("focusember:today") || 0);
        function fmt(s) {
          return (
            String(Math.floor(s / 60)).padStart(2, "0") +
            ":" +
            String(s % 60).padStart(2, "0")
          );
        }
        function draw() {
          $("clock").textContent = fmt(left);
          $("phase").textContent =
            mode === "focus" ? "FOCUS SESSION" : "RECOVERY BREAK";
          $("stats").textContent =
            "Today: " +
            sessions +
            " completed focus session" +
            (sessions === 1 ? "" : "s");
          $("start").textContent = running
            ? "Pause"
            : left <
                (mode === "focus"
                  ? +$("focus").value * 60
                  : +$("break").value * 60)
              ? "Resume"
              : "Start";
        }
        function tick() {
          left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
          draw();
          if (!left) {
            clearInterval(timer);
            running = false;
            if (mode === "focus") {
              sessions++;
              localStorage.setItem("focusember:today", sessions);
            }
            mode = mode === "focus" ? "break" : "focus";
            left =
              (mode === "focus" ? +$("focus").value : +$("break").value) * 60;
            draw();
          }
        }
        $("start").onclick = function () {
          if (running) {
            left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
            clearInterval(timer);
            running = false;
          } else {
            end = Date.now() + left * 1000;
            running = true;
            timer = setInterval(tick, 250);
          }
          draw();
        };
        function reset() {
          clearInterval(timer);
          running = false;
          left =
            (mode === "focus" ? +$("focus").value : +$("break").value) * 60;
          draw();
        }
        $("reset").onclick = reset;
        $("skip").onclick = function () {
          mode = mode === "focus" ? "break" : "focus";
          reset();
        };
        ["focus", "break"].forEach(function (id) {
          $(id).onchange = reset;
        });
        draw();
      })();
