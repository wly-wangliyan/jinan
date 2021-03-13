export class AmapInfoWindowHelper {
    public static init(list: Array<InfoWindow>, offset: any) {
        const infoElements = document.createElement('div');
        infoElements.className = 'inside-amap-content-window';

        list.forEach(item => {
            const row = document.createElement(item.element || 'div');
            row.className = `amap-content-window-row ${item.className}`;
            switch (item.element) {
                case 'img':
                    (row as HTMLImageElement).src = item.content;
                    break;
                case 'div':
                default:
                    row.innerHTML = item.content;
                    break;
            }
            if (item.func) {
                row.addEventListener(item.eventType, item.func);
            }
            infoElements.appendChild(row);
        });

        const infoWindow = new AMap.InfoWindow({
            isCustom: true,  // 使用自定义窗体
            content: infoElements,
            offset
        });
        return infoWindow;
    }
}

export interface InfoWindow {
    element?: string;
    className?: string;
    content: string;
    func?: any;
    eventType?: string;
}
