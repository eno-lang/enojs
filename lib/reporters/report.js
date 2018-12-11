module.exports = (context, emphasized = [], indicated = []) => {
  if(!Array.isArray(emphasized)) {
    emphasized = [emphasized];
  }

  if(!Array.isArray(indicated)) {
    indicated = [indicated];
  }

  const report = require(`./${context.reporter}.js`);

  return report(context, emphasized, indicated);
}
