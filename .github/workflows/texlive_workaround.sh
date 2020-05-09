#!/bin/sh
set -e

ln -sf /opt/texlive/texdir/texmf-dist/scripts/xindy/xindy.pl /opt/texlive/texdir/bin/x86_64-linuxmusl/xindy
ln -sf /opt/texlive/texdir/texmf-dist/scripts/xindy/texindy.pl /opt/texlive/texdir/bin/x86_64-linuxmusl/texindy
wget https://sourceforge.net/projects/xindy/files/xindy-source-components/2.4/xindy-kernel-3.0.tar.gz
tar xf xindy-kernel-3.0.tar.gz
cd xindy-kernel-3.0/src
apk add make
apk add clisp --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing
make
cp -f xindy.mem /opt/texlive/texdir/bin/x86_64-linuxmusl/
cd ../..