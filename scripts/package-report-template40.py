"""Package the Artifact Tool-authored workbook as a browser export template."""
from pathlib import Path
from zipfile import ZipFile
import json,sys,xml.etree.ElementTree as E
source=Path(sys.argv[1]).resolve()
root=Path(__file__).resolve().parent.parent
ns={'x':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
E.register_namespace('',ns['x'])
with ZipFile(source/'report-template40.xlsx') as z:
    files={n:z.read(n).decode('utf-8-sig') for n in z.namelist()}
styles=[]
for i in range(2):
    name=f'xl/worksheets/sheet{i+1}.xml'
    tree=E.fromstring(files[name])
    styles.append([int(c.attrib.get('s',0)) for c in tree.find('.//x:row[@r="6"]',ns)])
    files[name]='<?xml version="1.0" encoding="utf-8"?>'+E.tostring(tree,encoding='unicode')
assert [len(s) for s in styles]==[19,20]
data={'files':files,'schema':json.loads((source/'schema.json').read_text()),'styles':styles}
(root/'public/report-template40.js').write_text('globalThis.JoranReportTemplate40='+json.dumps(data,ensure_ascii=False)+';\n')
print('Two-sheet export template packaged.')
