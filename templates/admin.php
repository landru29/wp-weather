<div class="wrap">
    <h1>Meteo</h1>

    <h2>Prerequisite</h2>
    <p>First of all, go and visite <a href="https://account.avwx.rest/">https://account.avwx.rest</a>. Create an account and a token.</p>

    <form method="post" action="options.php">
    <?php
        settings_fields( 'meteo' );
        do_settings_sections( 'meteo' );
        submit_button();
    ?>
    </form>
</div>

