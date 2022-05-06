/**
 * 初始化前的预处理
 */

// 初始化环境变量
process.env.dev = (process.env.NODE_ENV == 'development' ? true : false );

console.log(`

      ______                      __  __                   
     / ____/_  ______________  __/ / / /___  ____ ___  ___ 
    / /_  / / / / ___/ ___/ / / / /_/ / __ \\/ __ \`__ \\/ _ \\
   / __/ / /_/ / /  / /  / /_/ / __  / /_/ / / / / / /  __/
  /_/    \\__,_/_/  /_/   \\__, /_/ /_/\\____/_/ /_/ /_/\\___/ 
                       /____/       
                       

      Author: 玖叁 @colour93
      GitHub: https://github.com/colour93

`)
if (process.env.dev) {
      console.log("当前为开发环境");
}
