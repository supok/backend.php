@ECHO OFF

REM If running for the first time only
IF NOT EXIST "apigen.phar" curl -L -O https://github.com/ApiGen/ApiGen.github.io/raw/master/apigen.phar

php apigen.phar generate -s ../library --skip-doc-path="../library/vendors" --exclude="/vendors" --no-source-code -d ../documentation
