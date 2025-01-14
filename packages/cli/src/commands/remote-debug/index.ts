/**
 * 目前仅服务于钉钉inside小程序场景
 * 
 * 参考：https://yuque.antfin.com/docs/share/f5fdcc3d-e6ec-4f00-b598-0bda87a55aa0?#
 */

import CommandWrapper from '../../scheduler/command/commandWrapper';
import { ECommandName, } from '../../lib/common/types';
import commandsConfig from '../commandsConfig';
import { IRemoteDebugArgs, minidev, } from 'minidev';
 
interface ICommandOptions {
  'appId': string;
  'autoPush'?: boolean;
  'ignoreHttpDomainCheck'?: boolean;
  'ignoreWebviewDomainCheck'?: boolean;
  'clientType'?: string;
  page?: string;
  'pageQuery'?: string;
  query?: string;
  scene?: string;
  'bundleId'?: string;
}
 
export default CommandWrapper<ICommandOptions>({
  name: ECommandName.remoteDebug,
  registerCommand(ctx) {
    return {
      ...commandsConfig['remote-debug'],
      action: async (options) => {
        ctx.logger.debug('cli options', options);
        
        const debugParams: IRemoteDebugArgs = {
          appId:  options.appId,
          project: options.cwd,
          autoPush: options.autoPush || false,
          clientType: options.clientType || 'alipay',
          ignoreHttpDomainCheck: options.ignoreHttpDomainCheck || true,
          ignoreWebViewDomainCheck: options.ignoreWebviewDomainCheck || true,
          page: options['page'],
          pageQuery: options.pageQuery,
          query: options['query'],
          scene: options['scene'],
          bundleId: options.bundleId || 'com.alibaba.dingtalk',
          autoOpenDevtool: true,
        };

        ctx.logger.debug('remoteDebugParams', debugParams);

        try {
          const { 
            qrcodeUrl, 
            debugUrl, 
          } = await minidev.remoteDebug(debugParams);
  
          ctx.logger.debug('qrcodeUrl', qrcodeUrl);
  
          ctx.logger.debug('debugUrl', debugUrl);
        } catch(e) {
          ctx.logger.error(e.message);

          /**
           * remote-debug进程没有自动退出
           */
          process.exit();
        }
      },
    };
  },
});