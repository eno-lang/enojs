module.exports = (context, emphasized = [], marked = []) => {
  if(!Array.isArray(emphasized)) {
    emphasized = [emphasized];
  }

  if(!Array.isArray(marked)) {
    marked = [marked];
  }

  const report = require(`./${context.reporter || 'text'}.js`);

  return report(context, emphasized, marked);
}
