from pathlib import Path
import shutil
p=Path(__file__).resolve().parents[1];d=p/'dist'
if d.exists():shutil.rmtree(d)
d.mkdir()
for name in ['index.html', '404.html', 'robots.txt', 'sitemap.xml', '_headers', 'assets', 'css', 'js', 'content', 'work', 'ru', 'en']:
 f=p/name
 if f.is_dir():shutil.copytree(f,d/name)
 elif f.exists():shutil.copy2(f,d/name)
print('Ready for hosting: dist/')
