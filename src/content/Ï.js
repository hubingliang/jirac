fetch('https://jira.advai.net/secure/DetailsViewAjaxIssueAction.jspa?decorator=none', {
  credentials: 'include',
  headers: {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'x-ausername': 'bingliang.hu%40advance.ai',
    'x-requested-with': 'XMLHttpRequest',
    'x-sitemesh-off': 'true',
  },
  referrer:
    'https://jira.advai.net/secure/RapidBoard.jspa?rapidView=64&view=detail&selectedIssue=PH-870',
  referrerPolicy: 'no-referrer-when-downgrade',
  body:
    'summary=xxxx&issueId=21623&atl_token=B2B9-FVK1-QWVJ-22QQ_517632ca7dd2f3a020c6de8106a37fb6c42fc823_lin&singleFieldEdit=true&fieldsToForcePresent=summary&skipScreenCheck=true&rapidViewId=64',
  method: 'POST',
  mode: 'cors',
})
