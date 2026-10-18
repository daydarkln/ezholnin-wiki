#!/usr/bin/env bash
set -euo pipefail

release_sha="${RELEASE_SHA:?RELEASE_SHA is required}"
bundle_path="${BUNDLE_PATH:?BUNDLE_PATH is required}"
app_root="/srv/www/sites/wiki"
release_dir="${app_root}/releases/${release_sha}"
site_name="wiki.ezholnin.ru"
nginx_available="/etc/nginx/sites-available/${site_name}.conf"
nginx_enabled="/etc/nginx/sites-enabled/${site_name}.conf"

mkdir -p "${app_root}/releases" "${app_root}/acme"
rm -rf "${release_dir}"
mkdir -p "${release_dir}"
tar -xzf "${bundle_path}" -C "${release_dir}"
ln -sfn "${release_dir}" "${app_root}/current"

ln -sfn "${app_root}/current/deploy/nginx-wiki.bootstrap.conf" "${nginx_available}"
ln -sfn "${nginx_available}" "${nginx_enabled}"
nginx -t
systemctl reload nginx

if [ ! -f "/etc/letsencrypt/live/${site_name}/fullchain.pem" ]; then
  certbot certonly --webroot --webroot-path "${app_root}/acme" --non-interactive --agree-tos --register-unsafely-without-email --domain "${site_name}"
fi

ln -sfn "${app_root}/current/deploy/nginx-wiki.conf" "${nginx_available}"
nginx -t
systemctl reload nginx

rm -f "${bundle_path}"
find "${app_root}/releases" -mindepth 1 -maxdepth 1 -type d -mtime +14 -exec rm -rf {} +
