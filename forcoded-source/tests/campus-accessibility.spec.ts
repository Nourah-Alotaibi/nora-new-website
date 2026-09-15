import {writeFileSync} from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import {test,expect} from '@playwright/test';
test('campus accessibility and six-room navigation in reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.goto('/');await page.locator('.loader').waitFor({state:'hidden'});await page.getByRole('button',{name:'Wake laptop',exact:true}).click();await page.getByRole('button',{name:'Enter laptop',exact:true}).click();
 await page.getByRole('button',{name:'Downstairs',exact:true}).click();await page.getByRole('group',{name:'Choose room'}).getByRole('button',{name:/Academy X/}).click();
 const result=await new AxeBuilder({page}).analyze();writeFileSync('../../work/campus-axe.json',JSON.stringify(result.violations,null,2));expect(result.violations).toEqual([]);
 expect(await page.locator('.intro').evaluate(el=>el.getBoundingClientRect().left)).toBeGreaterThanOrEqual(16); await page.locator('.toast').waitFor({state:'hidden'}); await page.screenshot({path:'previews/six-room-mobile.png',fullPage:true});
});


