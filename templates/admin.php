<div class="wrap">
    <h1>Weather</h1>

    <h2>Prerequisite</h2>
    <ol>
    <li>First of all, go and visite <a href="https://account.avwx.rest/">https://account.avwx.rest</a>. Create an account and a token.</li>
    <li>Then, add locations. for instance: 
        <input type="text" value="LFRN (St Jacques)" size="15" readonly="readonly" style="text-align: center; width: 270px;" onclick="this.focus();this.select()" title="To copy, click the field then press Ctrl + C (PC) or Cmd + C (Mac).">
    </li>
    <li>And finally, add the following short bloc in your publication: 
        <input type="text" value="[weather]" size="15" readonly="readonly" style="text-align: center; width: 80px;" onclick="this.focus();this.select()" title="To copy, click the field then press Ctrl + C (PC) or Cmd + C (Mac).">
    </li>

    </ol>
    <form method="post" action="options.php" id="weather-settings">
    <?php
        settings_fields( 'weather' );
        do_settings_sections( 'weather' );
        submit_button();
    ?>
        <input type="hidden" name="weather_location" id="weather_location">
    </form>
    <script>
        const form = document.getElementById("weather-settings");
        form.addEventListener("submit", function(evt) {
            evt.preventDefault();
            const hidden = document.getElementById("weather_location");
            const loc =  Array.from(document.getElementsByClassName("location")).map(
                function(element, index, array) {
                    if (!element.value.length) {
                        return element.value;
                    }
                    var val = element.value;
                    if (!val.includes('(') || !val.includes('(')) {
                        val += '(' + val + ')';
                    }
                    return val;
                }
            );
            hidden.value = loc.filter(function(elt) {return (''+elt).trim() != ''}).join('/');

            const submitFormFunction = Object.getPrototypeOf(form).submit;
            submitFormFunction.call(form);
        });

        function weatherAddLoc() {
            const locationSet = document.getElementById("location-set");
            var count = locationSet.children.length;
            var inp = document.createElement('input');
            inp.type = 'text';
            inp.className = "location";
            inp.name = "location" + count;
            inp.id = "location" + count;
            inp.placeholder = 'ICAO location';
            locationSet.append(inp);
        }
    </script>
</div>

